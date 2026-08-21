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
        const limit = body.limit || 1;
        const pageSize = body.pageSize || 1;

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
          } else {
            // Extract Username
            const cleanUrl = targetUrl.split('#')[0].split('?')[0];
            const urlParts = cleanUrl.split('/').filter(Boolean);
            const username = urlParts[urlParts.length - 1];
            
            console.log(`[Worker] Resolving username: ${username}`);

            await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            const finalPageUrl = page.url();
            
            // FASE 2F.7 - Instrumentação de Diagnóstico Real
            const diagResult = await page.evaluate(async (uname) => {
              const results: any = {
                shopIdStrategy: "shop-base-username",
                shopBaseStatus: 0,
                shopBaseContentType: null,
                shopBaseResponseSize: 0,
                shopBaseKeys: [],
                shopBaseHasData: false,
                shopBaseHasShopId: false,
                fallbackGetStatus: 0,
                fallbackGetResponseSize: 0,
                fallbackGetKeys: [],
                fallbackGetHasData: false,
                fallbackGetHasShopId: false,
                shopId: null
              };

              try {
                // 1. POST /api/v4/shop/get_shop_base_v2
                const postResp = await fetch('https://shopee.com.br/api/v4/shop/get_shop_base_v2', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    request_source: "mobile_shop_home_page",
                    livestream_params: {},
                    username: uname
                  })
                });
                
                results.shopBaseStatus = postResp.status;
                results.shopBaseContentType = postResp.headers.get('content-type');
                const postText = await postResp.text();
                results.shopBaseResponseSize = postText.length;
                
                try {
                  const postJson = JSON.parse(postText);
                  results.shopBaseKeys = Object.keys(postJson);
                  results.shopBaseHasData = !!postJson.data;
                  const sid = postJson.data?.shopid || postJson.shopid;
                  if (sid) {
                    results.shopBaseHasShopId = true;
                    results.shopId = sid.toString();
                  }
                } catch (e) {}

                // 2. GET /api/v4/shop/get_shop_base?username=<username>
                const getResp = await fetch(`https://shopee.com.br/api/v4/shop/get_shop_base?username=${uname}`);
                results.fallbackGetStatus = getResp.status;
                const getText = await getResp.text();
                results.fallbackGetResponseSize = getText.length;
                
                try {
                  const getJson = JSON.parse(getText);
                  results.fallbackGetKeys = Object.keys(getJson);
                  results.fallbackGetHasData = !!getJson.data;
                  const sid = getJson.data?.shopid || getJson.shopid;
                  if (sid) {
                    results.fallbackGetHasShopId = true;
                    if (!results.shopId) results.shopId = sid.toString();
                  }
                } catch (e) {}

              } catch (e) {
                console.error("Diagnostic fetch error:", e);
              }
              
              return results;
            }, username);

            // Registrar metadados e URL final conforme solicitado
            const diagnostics = {
              ...diagResult,
              finalPageUrl,
              username
            };
            // Remover campo temporário de shopId do objeto de diagnóstico para não poluir
            delete (diagnostics as any).shopId;

            (globalThis as any).diag = diagnostics;

            if (diagResult.shopId) {
              resolvedShopId = diagResult.shopId;
              method = 'shop-base-username';
            }

            // Fallbacks de segurança se a instrumentação não pegou o ID (não mudar lógica existente, apenas diagnosticar)
            if (!resolvedShopId) {
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

          // 6. Real Catalog Fetch (search_items)
          const searchResult = await page.evaluate(async ({ sid, lmt, psz }) => {
            try {
              const resp = await fetch('https://shopee.com.br/api/v4/search/search_items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  shopid: parseInt(sid),
                  limit: lmt,
                  offset: 0,
                  pageSize: psz
                })
              });
              const json = await resp.json() as any;
              return { status: resp.status, items: json.items || [] };
            } catch (e) {
              return { status: 0, error: String(e) };
            }
          }, { sid: resolvedShopId, lmt: limit, psz: pageSize });

          return new Response(JSON.stringify({
            success: true,
            source: 'shopee',
            shopId: resolvedShopId,
            items: searchResult.items || [],
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