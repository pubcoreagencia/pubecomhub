import { chromium } from '@cloudflare/playwright';

export interface Env {
  BROWSER: any;
  CATALOG_WORKER_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Health Check (Sem token)
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ ok: true, service: "pub-ecom-catalog-worker" }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Auth Check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${env.CATALOG_WORKER_TOKEN}`) {
      return new Response(JSON.stringify({ success: false, errors: ['Unauthorized'] }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Ingestion Route
    if (url.pathname === '/ingestion/shopee' && request.method === 'POST') {
      try {
        const body: any = await request.json();
        const targetUrl = body.url;

        // 4. SSRF & Target Validation
        if (!targetUrl) {
          return new Response(JSON.stringify({ success: false, errors: ['URL is required'] }), { status: 400 });
        }

        const validHost = 'shopee.com.br';
        try {
          const parsedUrl = new URL(targetUrl);
          if (parsedUrl.hostname !== validHost && !parsedUrl.hostname.endsWith('.' + validHost)) {
            return new Response(JSON.stringify({ success: false, errors: ['Invalid Host: Only Shopee is allowed'] }), { status: 400 });
          }
          // Bloqueio de IPs locais/reservados (SSRF básico)
          const blockedPatterns = [/^(127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.)/, /localhost/];
          if (blockedPatterns.some(pattern => pattern.test(parsedUrl.hostname))) {
            return new Response(JSON.stringify({ success: false, errors: ['Forbidden URL'] }), { status: 400 });
          }
        } catch {
          return new Response(JSON.stringify({ success: false, errors: ['Malformed URL'] }), { status: 400 });
        }

        const startTime = Date.now();
        console.log(`[Worker] Starting resolution for: ${targetUrl}`);

        const browser = await chromium.launch(env.BROWSER);
        const context = await browser.newContext();
        const page = await context.newPage();

        let resolvedShopId: string | null = null;
        let method = 'none';

        try {
          // 5. ShopID Resolution Strategy
          const shopNumericMatch = targetUrl.match(/\/shop\/(\d+)/);
          
          if (shopNumericMatch) {
            resolvedShopId = shopNumericMatch[1];
            method = 'url_pattern';
            console.log(`[Worker] ShopID resolved via URL: ${resolvedShopId}`);
          } else {
            // 5.1 Extract Username
            const cleanUrl = targetUrl.split('#')[0].split('?')[0];
            const urlParts = cleanUrl.split('/').filter(Boolean);
            const username = urlParts[urlParts.length - 1];
            
            console.log(`[Worker] Resolving username: ${username}`);

            await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            
            // 5.2 Strategy: API /api/v4/shop/get_shop_base_v2 (Context-based)
            const apiResult = await page.evaluate(async (uname) => {
              const results: any = {
                username: uname,
                post: { status: 0, hasData: false, hasShopId: false, keys: [], error: null, size: 0 },
                get: { status: 0, hasShopId: false }
              };

              try {
                // POST Strategy
                const postResp = await fetch('https://shopee.com.br/api/v4/shop/get_shop_base_v2', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: uname,
                    request_source: "mobile_shop_home_page",
                    livestream_params: {}
                  })
                });
                
                results.post.status = postResp.status;
                const text = await postResp.text();
                results.post.size = text.length;
                
                try {
                  const json = JSON.parse(text);
                  results.post.keys = Object.keys(json);
                  results.post.hasData = !!json.data;
                  results.post.shopid = json.data?.shopid || json.shopid || null;
                  results.post.hasShopId = !!results.post.shopid;
                } catch (e) {
                  results.post.error = "Invalid JSON";
                }

                // GET Strategy (Fallback documented)
                const getResp = await fetch(`https://shopee.com.br/api/v4/shop/get_shop_base?username=${uname}`);
                results.get.status = getResp.status;
                try {
                  const getJson = await getResp.json() as any;
                  results.get.shopid = getJson.data?.shopid || getJson.shopid || null;
                  results.get.hasShopId = !!results.get.shopid;
                } catch (e) {}

              } catch (e) {
                results.post.error = String(e);
              }
              return results;
            }, username);

            const diagMetadata = {
              shopIdStrategy: apiResult.post.hasShopId ? 'shop-base-username' : 'shop-base-username-error',
              shopBaseStatus: apiResult.post.status,
              shopBaseHasData: apiResult.post.hasData,
              shopBaseHasShopId: apiResult.post.hasShopId,
              shopBasePostSize: apiResult.post.size,
              shopBaseKeys: apiResult.post.keys,
              shopBaseError: apiResult.post.error,
              shopBaseGetStatus: apiResult.get.status,
              shopBaseGetHasShopId: apiResult.get.hasShopId,
              originalUrl: targetUrl,
              finalUrl: page.url(),
              extractedUsername: username
            };

            if (apiResult.post.shopid || apiResult.get.shopid) {
              resolvedShopId = (apiResult.post.shopid || apiResult.get.shopid).toString();
              method = apiResult.post.hasShopId ? 'shop-base-username' : 'shop-base-username-get';
            }

            // Merge diagnostics into final response if failure occurs later or succeeds
            (globalThis as any).diag = diagMetadata;

            // 5.3 Fallbacks if API fails
            if (!resolvedShopId) {
              // Strategy A: window.__PRELOADED_STATE__
              resolvedShopId = await page.evaluate(() => {
                return (globalThis as any).__PRELOADED_STATE__?.shop?.shopid || 
                       (globalThis as any).__PRELOADED_STATE__?.common?.shopid;
              });
              if (resolvedShopId) {
                resolvedShopId = resolvedShopId.toString();
                method = 'preloaded_state';
              }
            }

            if (!resolvedShopId) {
              // Strategy B: JSON-LD
              resolvedShopId = await page.evaluate(() => {
                const scripts = Array.from((globalThis as any).document.querySelectorAll('script[type="application/ld+json"]'));
                for (const script of scripts) {
                  try {
                    const data = JSON.parse((script as any).textContent || '{}');
                    if (data['@type'] === 'Store' && data['url']?.includes('shop/')) {
                      return data['url'].split('shop/')[1];
                    }
                  } catch (e) {}
                }
                return null;
              });
              if (resolvedShopId) method = 'json_ld';
            }
          }

          if (!resolvedShopId) {
            console.error(`[Worker] Failed to resolve ShopID for ${targetUrl}`);
            return new Response(JSON.stringify({
              success: false,
              source: 'shopee',
              shopId: null,
              items: [],
              metadata: { 
                provider: 'cloudflare-browser-run', 
                method, 
                strategy: method,
                diagnostics: (globalThis as any).diag 
              },
              errors: ['resolution-exhausted']
            }), { status: 404, headers: { 'Content-Type': 'application/json' } });
          }

          console.log(`[Worker] ShopID ${resolvedShopId} resolved via ${method}. Starting catalog fetch...`);

          // 6. Real Catalog Fetch (search_items)
          let items: any[] = [];
          const searchResult = await page.evaluate(async (sid) => {
            try {
              const resp = await fetch('https://shopee.com.br/api/v4/search/search_items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  shopid: parseInt(sid),
                  limit: 1,
                  offset: 0,
                  pageSize: 1
                })
              });
              const json = await resp.json() as any;
              return { status: resp.status, items: json.items || [] };
            } catch (e) {
              return { status: 0, error: String(e) };
            }
          }, resolvedShopId);

          items = searchResult.items || [];

          return new Response(JSON.stringify({
            success: true,
            source: 'shopee',
            shopId: resolvedShopId,
            items: items,
            metadata: {
              provider: 'cloudflare-browser-run',
              method,
              executionTimeMs: Date.now() - startTime,
              diagnostics: (globalThis as any).diag
            },
            errors: []
          }), { headers: { 'Content-Type': 'application/json' } });


        } finally {
          await browser.close();
        }


      } catch (error: any) {
        return new Response(JSON.stringify({
          success: false,
          errors: [error.message]
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
