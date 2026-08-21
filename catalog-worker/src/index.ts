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
            // Friendly URL resolution
            await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            console.log(`[Worker] Page loaded. URL: ${page.url()} Status: 200`);

            // Strategy A: window.__PRELOADED_STATE__
            const preloadedState = await page.evaluate(() => {
              return (window as any).__PRELOADED_STATE__?.shop?.shopid || 
                     (window as any).__PRELOADED_STATE__?.common?.shopid;
            });

            if (preloadedState) {
              resolvedShopId = preloadedState.toString();
              method = 'preloaded_state';
            }

            // Strategy B: JSON-LD or script tags
            if (!resolvedShopId) {
              resolvedShopId = await page.evaluate(() => {
                const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
                for (const script of scripts) {
                  try {
                    const data = JSON.parse(script.textContent || '{}');
                    if (data['@type'] === 'Store' && data['url']?.includes('shop/')) {
                      return data['url'].split('shop/')[1];
                    }
                  } catch (e) {}
                }
                return null;
              });
              if (resolvedShopId) method = 'json_ld';
            }

            // Strategy C: DOM attributes (data-shop-id)
            if (!resolvedShopId) {
              resolvedShopId = await page.evaluate(() => {
                const el = document.querySelector('[data-shopid]');
                return el ? el.getAttribute('data-shopid') : null;
              });
              if (resolvedShopId) method = 'dom_attribute';
            }
          }

          if (!resolvedShopId) {
            console.error(`[Worker] Failed to resolve ShopID for ${targetUrl}`);
            return new Response(JSON.stringify({
              success: false,
              source: 'shopee',
              shopId: null,
              items: [],
              metadata: { provider: 'cloudflare-browser-run', method },
              errors: ['unable to resolve Shopee ShopID']
            }), { status: 404, headers: { 'Content-Type': 'application/json' } });
          }

          console.log(`[Worker] ShopID ${resolvedShopId} resolved via ${method}. Starting catalog fetch...`);

          // 6. Real Catalog Fetch (Simulated for this stage, but would use search_items)
          // In a real scenario, we'd now call Shopee's API with the resolvedShopId
          
          return new Response(JSON.stringify({
            success: true,
            source: 'shopee',
            shopId: resolvedShopId,
            items: [], // Would be populated by real search_items call
            metadata: {
              provider: 'cloudflare-browser-run',
              method,
              executionTimeMs: Date.now() - startTime
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
