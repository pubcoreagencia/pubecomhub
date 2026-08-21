import { chromium } from '@cloudflare/playwright';

export interface Env {
  BROWSER: any;
  CATALOG_WORKER_TOKEN: string;
}

interface DiagnosticResult {
  shopId: string | null;
  strategy: string;
  username: string;
  finalPageUrl: string;
  shopBaseStatus: number;
  shopBaseContentType: string | null;
  shopBaseResponseSize: number;
  shopBaseKeys: string[];
  shopBaseHasData: boolean;
  shopBaseHasShopId: boolean;
  fallbackGetStatus: number;
  fallbackGetResponseSize: number;
  fallbackGetKeys: string[];
  fallbackGetHasData: boolean;
  fallbackGetHasShopId: boolean;
  productLinkCount: number;
  productLinkShopIds: string[];
}

async function resolveShopIdWithDiagnostics(page: any, targetUrl: string): Promise<DiagnosticResult> {
  const cleanUrl = targetUrl.split('#')[0].split('?')[0];
  const urlParts = cleanUrl.split('/').filter(Boolean);
  const username = urlParts[urlParts.length - 1] || '';
  
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const finalPageUrl = page.url();

  const diag = await page.evaluate(async (uname: string) => {
    const results = {
      shopId: null as string | null,
      shopBaseStatus: 0,
      shopBaseContentType: null as string | null,
      shopBaseResponseSize: 0,
      shopBaseKeys: [] as string[],
      shopBaseHasData: false,
      shopBaseHasShopId: false,
      fallbackGetStatus: 0,
      fallbackGetResponseSize: 0,
      fallbackGetKeys: [] as string[],
      fallbackGetHasData: false,
      fallbackGetHasShopId: false,
      productLinkCount: 0,
      productLinkShopIds: [] as string[],
    };

    try {
      // Strategy: Product Link Extraction
      const links = Array.from(document.querySelectorAll('a[href]'));
      const productRegex = /i\.(\d{4,})\.(\d{4,})(?:[/?#]|$)/i;
      const shopIdMap: Record<string, number> = {};
      
      links.forEach(link => {
        const href = (link as HTMLAnchorElement).href;
        const match = href.match(productRegex);
        if (match && match[1]) {
          const sid = match[1];
          shopIdMap[sid] = (shopIdMap[sid] || 0) + 1;
        }
      });

      const uniqueShopIds = Object.keys(shopIdMap);
      results.productLinkCount = links.length;
      results.productLinkShopIds = uniqueShopIds;

      if (uniqueShopIds.length > 0) {
        // Sort by frequency
        uniqueShopIds.sort((a, b) => shopIdMap[b] - shopIdMap[a]);
        results.shopId = uniqueShopIds[0];
        // If we found a consistent shopId via product links, we can stop here or mark it
      }

      // POST /api/v4/shop/get_shop_base_v2 (only if not found or for diagnostics)
      if (!results.shopId) {
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
        } catch {}
      }

      // GET /api/v4/shop/get_shop_base?username=<username>
      if (!results.shopId) {
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
            results.shopId = sid.toString();
          }
        } catch {}
      }
    } catch (e) {
      console.error("Diagnostic error:", e);
    }

    return results;
  }, username);

  return {
    ...diag,
    strategy: diag.shopId ? (diag.productLinkShopIds.length > 0 && diag.shopId === diag.productLinkShopIds[0] ? 'product-link' : 'shop-base-diagnostic') : 'none',
    username,
    finalPageUrl
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ ok: true, service: "pub-ecom-catalog-worker" }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${env.CATALOG_WORKER_TOKEN}`) {
      return new Response(JSON.stringify({ success: false, errors: ['Unauthorized'] }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/ingestion/shopee' && request.method === 'POST') {
      try {
        const body: any = await request.json();
        const targetUrl = body.url;
        const limit = body.limit || 1;
        const pageSize = body.pageSize || 1;

        if (!targetUrl) {
          return new Response(JSON.stringify({ success: false, errors: ['URL is required'] }), { status: 400 });
        }

        const browser = await chromium.launch(env.BROWSER);
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
          const startTime = Date.now();
          const diag = await resolveShopIdWithDiagnostics(page, targetUrl);
          let resolvedShopId = diag.shopId;
          let method = diag.strategy;

          // Only if primary diagnostic failed, check fallbacks (but keep diag for metadata)
          if (!resolvedShopId) {
            resolvedShopId = await page.evaluate(() => {
              const state = (globalThis as any).__PRELOADED_STATE__;
              return state?.shop?.shopid || state?.common?.shopid;
            });
            if (resolvedShopId) {
              resolvedShopId = resolvedShopId.toString();
              method = 'preloaded_state';
            }
          }

          if (!resolvedShopId) {
            resolvedShopId = await page.evaluate(() => {
              const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
              for (const script of scripts as HTMLScriptElement[]) {
                try {
                  const data = JSON.parse(script.textContent || '{}');
                  if (data['@type'] === 'Store' && data['url']?.includes('shop/')) {
                    return data['url'].split('shop/')[1];
                  }
                } catch {}
              }
              return null;
            });
            if (resolvedShopId) method = 'json_ld';
          }

          const metadata = {
            provider: 'cloudflare-browser-run',
            shopIdStrategy: method,
            username: diag.username,
            finalPageUrl: diag.finalPageUrl,
            productLinkCount: diag.productLinkCount,
            productLinkShopIds: diag.productLinkShopIds,
            shopBaseStatus: diag.shopBaseStatus,
            shopBaseContentType: diag.shopBaseContentType,
            shopBaseResponseSize: diag.shopBaseResponseSize,
            shopBaseKeys: diag.shopBaseKeys,
            shopBaseHasData: diag.shopBaseHasData,
            shopBaseHasShopId: diag.shopBaseHasShopId,
            fallbackGetStatus: diag.fallbackGetStatus,
            fallbackGetResponseSize: diag.fallbackGetResponseSize,
            fallbackGetKeys: diag.fallbackGetKeys,
            fallbackGetHasData: diag.fallbackGetHasData,
            fallbackGetHasShopId: diag.fallbackGetHasShopId,
            executionTimeMs: Date.now() - startTime
          };

          if (!resolvedShopId) {
            return new Response(JSON.stringify({
              success: false,
              source: 'shopee',
              shopId: null,
              items: [],
              metadata,
              errors: ['unable to resolve Shopee ShopID']
            }), { status: 404, headers: { 'Content-Type': 'application/json' } });
          }

          const searchResult = await page.evaluate(async ({ sid, lmt, psz }: { sid: string, lmt: number, psz: number }) => {
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
            metadata,
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