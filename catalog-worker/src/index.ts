import { chromium } from "@cloudflare/playwright";
import { getCorsHeaders, handleOptions } from "./cors";
import { isAllowedTargetUrl } from "./security";

export interface Env {
  BROWSER: any;
  DB?: any;
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

async function resolveShopIdWithDiagnostics(
  page: any,
  targetUrl: string,
): Promise<DiagnosticResult> {
  const cleanUrl = targetUrl.split("#")[0].split("?")[0];
  const urlParts = cleanUrl.split("/").filter(Boolean);
  const username = urlParts[urlParts.length - 1] || "";

  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
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
      const links = Array.from(document.querySelectorAll("a[href]"));
      const productRegex = /i\.(\d{4,})\.(\d{4,})(?:[/?#]|$)/i;
      const shopIdMap: Record<string, number> = {};

      links.forEach((link) => {
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
        uniqueShopIds.sort((a, b) => shopIdMap[b] - shopIdMap[a]);
        results.shopId = uniqueShopIds[0];
      }

      // POST /api/v4/shop/get_shop_base_v2 (only if not found or for diagnostics)
      if (!results.shopId) {
        const postResp = await fetch("https://shopee.com.br/api/v4/shop/get_shop_base_v2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            request_source: "mobile_shop_home_page",
            livestream_params: {},
            username: uname,
          }),
        });

        results.shopBaseStatus = postResp.status;
        results.shopBaseContentType = postResp.headers.get("content-type");
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
        } catch {
          // ignore JSON parse error in diagnostic probe
        }
      }

      // GET /api/v4/shop/get_shop_base?username=<username>
      if (!results.shopId) {
        const getResp = await fetch(
          `https://shopee.com.br/api/v4/shop/get_shop_base?username=${uname}`,
        );
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
        } catch {
          // ignore JSON parse error in diagnostic probe
        }
      }
    } catch (e) {
      console.error("Diagnostic error:", e);
    }

    return results;
  }, username);

  return {
    ...diag,
    strategy: diag.shopId
      ? diag.productLinkShopIds.length > 0 && diag.shopId === diag.productLinkShopIds[0]
        ? "product-link"
        : "shop-base-diagnostic"
      : "none",
    username,
    finalPageUrl,
  };
}

async function ensureD1Tables(db: any) {
  if (!db) return;
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT,
        source TEXT NOT NULL DEFAULT 'shopee',
        shop_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        sync_state TEXT NOT NULL DEFAULT 'idle',
        product_count INTEGER DEFAULT 0,
        last_sync_at TEXT,
        last_sync_status TEXT,
        metadata TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        external_id TEXT NOT NULL,
        store_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'BRL',
        images TEXT NOT NULL DEFAULT '[]',
        url TEXT NOT NULL DEFAULT '',
        sku TEXT,
        category TEXT,
        source TEXT NOT NULL DEFAULT 'shopee',
        metadata TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(store_id, external_id)
      );

      CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    `);
  } catch (err) {
    console.error("[ensureD1Tables] Warning:", err);
  }
}

async function persistToD1(db: any, shopId: string, username: string, items: any[]) {
  if (!db || !Array.isArray(items) || items.length === 0) {
    return { created: 0, updated: 0, total: items?.length || 0 };
  }

  await ensureD1Tables(db);

  const storeId = `shopee:${shopId}`;
  const storeName = username || `Loja Shopee ${shopId}`;

  // 1. Upsert Store
  await db
    .prepare(
      `INSERT INTO stores (id, name, username, source, shop_id, status, sync_state, product_count, last_sync_at, last_sync_status, updated_at)
       VALUES (?, ?, ?, 'shopee', ?, 'active', 'success', ?, datetime('now'), 'success', datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         username = excluded.username,
         product_count = excluded.product_count,
         last_sync_at = datetime('now'),
         last_sync_status = 'success',
         updated_at = datetime('now')`,
    )
    .bind(storeId, storeName, username, shopId, items.length)
    .run();

  let createdCount = 0;
  let updatedCount = 0;

  // 2. Upsert Products
  for (const raw of items) {
    const item = raw.item_basic || raw;
    const externalId = String(item.itemid || item.id || raw.itemid || "");
    if (!externalId) continue;

    const productId = `${storeId}:${externalId}`;
    const title = item.name || item.title || "Produto Shopee";
    
    // Shopee raw price is in micro-units (e.g. 2990000 = R$ 29.90), or already decimal
    let rawPrice = item.price || item.price_min || item.price_before_discount || 0;
    const price = rawPrice > 1000 ? rawPrice / 100000 : rawPrice;
    
    const currency = item.currency || "BRL";
    
    let imagesList: string[] = [];
    if (Array.isArray(item.images)) {
      imagesList = item.images.map((img: string) =>
        img.startsWith("http") ? img : `https://cf.shopee.com.br/file/${img}`,
      );
    } else if (item.image) {
      const img = item.image;
      imagesList = [img.startsWith("http") ? img : `https://cf.shopee.com.br/file/${img}`];
    }
    
    const productUrl =
      item.url ||
      (username
        ? `https://shopee.com.br/${username}/i.${shopId}.${externalId}`
        : `https://shopee.com.br/product/${shopId}/${externalId}`);
    
    const sku = item.sku || `SKU-${externalId}`;
    const category = item.category || "Geral";
    const imagesJson = JSON.stringify(imagesList);

    // Check if exists for accurate created vs updated count
    const existing = await db
      .prepare("SELECT id FROM products WHERE store_id = ? AND external_id = ?")
      .bind(storeId, externalId)
      .first();

    if (existing) {
      updatedCount++;
    } else {
      createdCount++;
    }

    await db
      .prepare(
        `INSERT INTO products (id, external_id, store_id, title, description, price, currency, images, url, sku, category, source, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'shopee', datetime('now'))
         ON CONFLICT(store_id, external_id) DO UPDATE SET
           title = excluded.title,
           price = excluded.price,
           currency = excluded.currency,
           images = excluded.images,
           url = excluded.url,
           sku = excluded.sku,
           category = excluded.category,
           updated_at = datetime('now')`,
      )
      .bind(
        productId,
        externalId,
        storeId,
        title,
        item.description || null,
        price,
        currency,
        imagesJson,
        productUrl,
        sku,
        category,
      )
      .run();
  }

  return {
    total: items.length,
    created: createdCount,
    updated: updatedCount,
    storageProvider: "d1",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const corsHeaders = getCorsHeaders(origin);

    // 1. Handle Preflight
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    // Wrap the inner logic to add CORS to all responses
    const handleRequest = async () => {
      // Health Check
      if (url.pathname === "/health" && request.method === "GET") {
        return new Response(
          JSON.stringify({
            ok: true,
            service: "pub-ecom-catalog-worker",
            catalogStorage: env.DB ? "d1" : "memory",
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Auth Check for Protected Routes
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || authHeader !== `Bearer ${env.CATALOG_WORKER_TOKEN}`) {
        return new Response(JSON.stringify({ success: false, errors: ["Unauthorized"] }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // ----------------------------------------------------
      // CATALOG READ ROUTES (D1 PERSISTENCE)
      // ----------------------------------------------------

      // GET /v1/catalog/products
      if (url.pathname === "/v1/catalog/products" && request.method === "GET") {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: true, items: [], total: 0, storage: "no-db" }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        await ensureD1Tables(env.DB);

        const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50"), 1), 200);
        const offset = Math.max(parseInt(url.searchParams.get("offset") || "0"), 0);
        const search = (url.searchParams.get("search") || "").trim();
        const storeId = (url.searchParams.get("storeId") || "").trim();

        let query = "SELECT * FROM products";
        let countQuery = "SELECT COUNT(*) as total FROM products";
        const conditions: string[] = [];
        const params: any[] = [];
        const countParams: any[] = [];

        if (storeId) {
          conditions.push("store_id = ?");
          params.push(storeId);
          countParams.push(storeId);
        }

        if (search) {
          conditions.push("(title LIKE ? OR sku LIKE ? OR external_id LIKE ?)");
          const term = `%${search}%`;
          params.push(term, term, term);
          countParams.push(term, term, term);
        }

        if (conditions.length > 0) {
          query += " WHERE " + conditions.join(" AND ");
          countQuery += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const [rowsRes, countRes] = await Promise.all([
          env.DB.prepare(query).bind(...params).all(),
          env.DB.prepare(countQuery).bind(...countParams).first(),
        ]);

        const items = (rowsRes.results || []).map((row: any) => {
          let images: string[] = [];
          try {
            images = JSON.parse(row.images || "[]");
          } catch {
            images = [];
          }
          return {
            id: row.id,
            externalId: row.external_id,
            storeId: row.store_id,
            title: row.title,
            description: row.description,
            price: Number(row.price) || 0,
            currency: row.currency || "BRL",
            images,
            url: row.url,
            sku: row.sku,
            category: row.category,
            updatedAt: row.updated_at,
          };
        });

        return new Response(
          JSON.stringify({
            success: true,
            items,
            total: countRes?.total || items.length,
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      // GET /v1/catalog/stores
      if (url.pathname === "/v1/catalog/stores" && request.method === "GET") {
        if (!env.DB) {
          return new Response(JSON.stringify({ success: true, items: [] }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        await ensureD1Tables(env.DB);
        const rows = await env.DB.prepare("SELECT * FROM stores ORDER BY updated_at DESC").all();
        
        const items = (rows.results || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          username: row.username,
          source: row.source,
          shopId: row.shop_id,
          status: row.status,
          syncState: row.sync_state,
          productCount: Number(row.product_count) || 0,
          lastSyncAt: row.last_sync_at,
          lastSyncStatus: row.last_sync_status,
        }));

        return new Response(JSON.stringify({ success: true, items }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // GET /v1/catalog/stats
      if (url.pathname === "/v1/catalog/stats" && request.method === "GET") {
        if (!env.DB) {
          return new Response(
            JSON.stringify({
              success: true,
              stats: { products: 0, stores: 0, activeStores: 0, errorStores: 0 },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        await ensureD1Tables(env.DB);
        const [prodCount, storeCount] = await Promise.all([
          env.DB.prepare("SELECT COUNT(*) as total FROM products").first(),
          env.DB.prepare("SELECT COUNT(*) as total FROM stores").first(),
        ]);

        const products = prodCount?.total || 0;
        const stores = storeCount?.total || 0;

        return new Response(
          JSON.stringify({
            success: true,
            stats: {
              products,
              stores,
              activeStores: stores,
              errorStores: 0,
              sources: { shopee: { products, stores } },
              sync: { idle: stores, running: 0, success: stores, partial: 0, error: 0 },
            },
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      // Debug Browser Limits
      if (url.pathname === "/debug/browser" && request.method === "GET") {
        try {
          const [sessions, history, limits] = await Promise.all([
            (chromium as any).sessions?.(env.BROWSER) || [],
            (chromium as any).history?.(env.BROWSER) || [],
            (chromium as any).limits?.(env.BROWSER) || {},
          ]);

          return new Response(
            JSON.stringify({
              sessions,
              history,
              limits,
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          return new Response(
            JSON.stringify({
              success: false,
              errors: [error.message],
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      }

      // Ingestion Flow
      if (url.pathname === "/ingestion/shopee" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const targetUrl = body.url;
          const limit = body.limit || 1;
          const pageSize = body.pageSize || 1;

          if (!targetUrl) {
            return new Response(JSON.stringify({ success: false, errors: ["URL is required"] }), {
              status: 400,
            });
          }

          // SSRF Protection: enforce strict hostname allow-list BEFORE any browser navigation
          if (!isAllowedTargetUrl(targetUrl)) {
            return new Response(
              JSON.stringify({
                success: false,
                errors: ["Forbidden: URL is not an allowed Shopee target"],
              }),
              { status: 400 },
            );
          }

          const browser = await chromium.launch(env.BROWSER);
          const context = await browser.newContext();
          const page = await context.newPage();

          try {
            const startTime = Date.now();
            const diag = await resolveShopIdWithDiagnostics(page, targetUrl);
            let resolvedShopId = diag.shopId;
            let method = diag.strategy;

            if (!resolvedShopId) {
              resolvedShopId = await page.evaluate(() => {
                const state = (globalThis as any).__PRELOADED_STATE__;
                return state?.shop?.shopid || state?.common?.shopid;
              });
              if (resolvedShopId) {
                resolvedShopId = resolvedShopId.toString();
                method = "preloaded_state";
              }
            }

            if (!resolvedShopId) {
              resolvedShopId = await page.evaluate(() => {
                const scripts = Array.from(
                  document.querySelectorAll('script[type="application/ld+json"]'),
                );
                for (const script of scripts as HTMLScriptElement[]) {
                  try {
                    const data = JSON.parse(script.textContent || "{}");
                    if (data["@type"] === "Store" && data["url"]?.includes("shop/")) {
                      return data["url"].split("shop/")[1];
                    }
                  } catch {
                    // ignore malformed JSON-LD script block
                  }
                }
                return null;
              });
              if (resolvedShopId) method = "json_ld";
            }

            const metadata = {
              provider: "cloudflare-browser-run",
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
              executionTimeMs: Date.now() - startTime,
            };

            if (!resolvedShopId) {
              return new Response(
                JSON.stringify({
                  success: false,
                  source: "shopee",
                  shopId: null,
                  items: [],
                  metadata,
                  errors: ["unable to resolve Shopee ShopID"],
                }),
                { status: 404, headers: { "Content-Type": "application/json" } },
              );
            }

            const searchResult = await page.evaluate(
              async ({ sid, lmt, psz }: { sid: string; lmt: number; psz: number }) => {
                try {
                  const resp = await fetch("https://shopee.com.br/api/v4/search/search_items", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      shopid: parseInt(sid),
                      limit: lmt,
                      offset: 0,
                      pageSize: psz,
                    }),
                  });
                  const json = (await resp.json()) as any;
                  return { status: resp.status, items: json.items || [] };
                } catch (e) {
                  return { status: 0, error: String(e) };
                }
              },
              { sid: resolvedShopId, lmt: limit, psz: pageSize },
            );

            const items = searchResult.items || [];
            
            // Persist to D1 Database
            const masterCatalog = await persistToD1(
              env.DB,
              resolvedShopId,
              diag.username,
              items,
            );

            return new Response(
              JSON.stringify({
                success: true,
                source: "shopee",
                shopId: resolvedShopId,
                items,
                masterCatalog,
                metadata,
                errors: [],
              }),
              { headers: { "Content-Type": "application/json" } },
            );
          } finally {
            await browser.close();
          }
        } catch (error: any) {
          return new Response(
            JSON.stringify({
              success: false,
              errors: [error.message],
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      }

      return new Response("Not Found", { status: 404 });
    };

    // Execute handler and append CORS headers to all responses
    const response = await handleRequest();
    const newResponse = new Response(response.body, response);
    Object.entries(corsHeaders).forEach(([name, value]) => {
      newResponse.headers.set(name, value);
    });

    return newResponse;
  },
};
