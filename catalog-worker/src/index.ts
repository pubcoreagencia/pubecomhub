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

      // POST /api/v4/shop/get_shop_base_v2
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

      CREATE TABLE IF NOT EXISTS sync_runs (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL,
        status TEXT NOT NULL,
        trigger TEXT NOT NULL DEFAULT 'manual',
        requested_limit INTEGER NOT NULL DEFAULT 10,
        discovered INTEGER NOT NULL DEFAULT 0,
        created INTEGER NOT NULL DEFAULT 0,
        updated INTEGER NOT NULL DEFAULT 0,
        unchanged INTEGER NOT NULL DEFAULT 0,
        failed INTEGER NOT NULL DEFAULT 0,
        duration_ms INTEGER DEFAULT 0,
        error_message TEXT,
        started_at TEXT NOT NULL DEFAULT (datetime('now')),
        finished_at TEXT,
        metadata TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
      CREATE INDEX IF NOT EXISTS idx_sync_runs_store_id ON sync_runs(store_id);
      CREATE INDEX IF NOT EXISTS idx_sync_runs_started_at ON sync_runs(started_at);
    `);
  } catch (err) {
    console.error("[ensureD1Tables] Warning:", err);
  }
}

async function persistToD1(
  db: any,
  shopId: string,
  username: string,
  items: any[],
  customStoreName?: string,
) {
  if (!db || !Array.isArray(items) || items.length === 0) {
    return { created: 0, updated: 0, unchanged: 0, failed: 0, total: items?.length || 0 };
  }

  await ensureD1Tables(db);

  const storeId = `shopee:${shopId}`;
  const storeName = customStoreName || username || `Loja Shopee ${shopId}`;

  // 1. Upsert Store
  await db
    .prepare(
      `INSERT INTO stores (id, name, username, source, shop_id, status, sync_state, product_count, last_sync_at, last_sync_status, updated_at)
       VALUES (?, ?, ?, 'shopee', ?, 'active', 'success', ?, datetime('now'), 'success', datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         username = excluded.username,
         last_sync_at = datetime('now'),
         last_sync_status = 'success',
         updated_at = datetime('now')`,
    )
    .bind(storeId, storeName, username, shopId, items.length)
    .run();

  let createdCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;
  let failedCount = 0;

  // 2. Upsert Products
  for (const raw of items) {
    try {
      const item = raw.item_basic || raw;
      const externalId = String(item.itemid || item.id || raw.itemid || "");
      if (!externalId) {
        failedCount++;
        continue;
      }

      const productId = `${storeId}:${externalId}`;
      const title = item.name || item.title || "Produto Shopee";

      const rawPrice = item.price || item.price_min || item.price_before_discount || 0;
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

      const existing = await db
        .prepare(
          "SELECT title, price, sku, category FROM products WHERE store_id = ? AND external_id = ?",
        )
        .bind(storeId, externalId)
        .first();

      if (existing) {
        if (
          existing.title === title &&
          Number(existing.price) === price &&
          existing.sku === sku &&
          existing.category === category
        ) {
          unchangedCount++;
        } else {
          updatedCount++;
        }
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
    } catch (itemErr) {
      console.error("[persistToD1] Item error:", itemErr);
      failedCount++;
    }
  }

  // Update store total count after upserting products
  const storeTotalRow = await db
    .prepare("SELECT COUNT(*) as total FROM products WHERE store_id = ?")
    .bind(storeId)
    .first();
  const realStoreProductCount = storeTotalRow?.total || items.length;

  await db
    .prepare(
      `UPDATE stores SET product_count = ?, last_sync_at = datetime('now'), last_sync_status = 'success', sync_state = 'success', updated_at = datetime('now') WHERE id = ?`,
    )
    .bind(realStoreProductCount, storeId)
    .run();

  return {
    total: items.length,
    created: createdCount,
    updated: updatedCount,
    unchanged: unchangedCount,
    failed: failedCount,
    storeProductCount: realStoreProductCount,
    storageProvider: "d1",
  };
}

async function scrapeShopeeItems(env: Env, targetUrl: string, limit: number) {
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
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        for (const script of scripts as HTMLScriptElement[]) {
          try {
            const data = JSON.parse(script.textContent || "{}");
            if (data["@type"] === "Store" && data["url"]?.includes("shop/")) {
              return data["url"].split("shop/")[1];
            }
          } catch {
            // ignore JSON parse error
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
      return {
        success: false,
        shopId: null,
        username: diag.username,
        items: [],
        metadata,
        error: "Não foi possível resolver o ShopID da Shopee",
      };
    }

    const searchResult = await page.evaluate(
      async ({ sid, lmt }: { sid: string; lmt: number }) => {
        try {
          const resp = await fetch("https://shopee.com.br/api/v4/search/search_items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              shopid: parseInt(sid),
              limit: lmt,
              offset: 0,
              pageSize: lmt,
            }),
          });
          const json = (await resp.json()) as any;
          return { status: resp.status, items: json.items || [] };
        } catch (e) {
          return { status: 0, error: String(e), items: [] };
        }
      },
      { sid: resolvedShopId, lmt: limit },
    );

    return {
      success: true,
      shopId: resolvedShopId,
      username: diag.username,
      items: searchResult.items || [],
      metadata,
    };
  } finally {
    await browser.close();
  }
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

    // Wrap inner logic to append CORS to all responses
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
      // STORES MANAGEMENT & REFRESH ROUTES
      // ----------------------------------------------------

      // POST /v1/catalog/stores (Register Store without immediate full scrape)
      if (url.pathname === "/v1/catalog/stores" && request.method === "POST") {
        if (!env.DB) {
          return new Response(JSON.stringify({ success: false, error: "Database unavailable" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        await ensureD1Tables(env.DB);
        const body: any = await request.json().catch(() => ({}));
        const targetUrl = (body.url || "").trim();
        const customName = (body.name || "").trim();

        if (!targetUrl) {
          return new Response(JSON.stringify({ success: false, error: "URL é obrigatória" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!isAllowedTargetUrl(targetUrl)) {
          return new Response(
            JSON.stringify({ success: false, error: "URL fora da lista permitida (SSRF)" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Resolve ShopID
        const browser = await chromium.launch(env.BROWSER);
        const context = await browser.newContext();
        const page = await context.newPage();
        let diag: DiagnosticResult;
        try {
          diag = await resolveShopIdWithDiagnostics(page, targetUrl);
        } finally {
          await browser.close();
        }

        if (!diag.shopId) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Não foi possível resolver o ShopID da loja Shopee",
            }),
            { status: 404, headers: { "Content-Type": "application/json" } },
          );
        }

        const storeId = `shopee:${diag.shopId}`;
        const storeName = customName || diag.username || `Loja Shopee ${diag.shopId}`;

        // Check if store already exists
        const existing = await env.DB.prepare("SELECT * FROM stores WHERE id = ?")
          .bind(storeId)
          .first();

        if (existing) {
          return new Response(
            JSON.stringify({
              success: true,
              store: {
                id: existing.id,
                name: existing.name,
                username: existing.username,
                source: existing.source,
                shopId: existing.shop_id,
                status: existing.status,
                syncState: existing.sync_state,
                productCount: Number(existing.product_count) || 0,
                lastSyncAt: existing.last_sync_at,
                lastSyncStatus: existing.last_sync_status,
              },
              alreadyExists: true,
              message: "Loja já cadastrada.",
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        const metadataJson = JSON.stringify({
          url: targetUrl,
          registeredAt: new Date().toISOString(),
        });

        await env.DB.prepare(
          `INSERT INTO stores (id, name, username, source, shop_id, status, sync_state, product_count, last_sync_at, last_sync_status, metadata, created_at, updated_at)
           VALUES (?, ?, ?, 'shopee', ?, 'active', 'idle', 0, NULL, NULL, ?, datetime('now'), datetime('now'))`,
        )
          .bind(storeId, storeName, diag.username, diag.shopId, metadataJson)
          .run();

        return new Response(
          JSON.stringify({
            success: true,
            store: {
              id: storeId,
              name: storeName,
              username: diag.username,
              source: "shopee",
              shopId: diag.shopId,
              status: "active",
              syncState: "idle",
              productCount: 0,
              lastSyncAt: null,
              lastSyncStatus: null,
            },
            alreadyExists: false,
            message: "Loja cadastrada com sucesso.",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        );
      }

      // GET /v1/catalog/stores (List all stores)
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

      // Handling store routes under /v1/catalog/stores/:storeId/*
      if (url.pathname.startsWith("/v1/catalog/stores/")) {
        const subPath = url.pathname.slice("/v1/catalog/stores/".length);
        const parts = subPath.split("/").filter(Boolean);
        const storeId = decodeURIComponent(parts[0] || "");

        if (!storeId) {
          return new Response(JSON.stringify({ success: false, error: "Store ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        await ensureD1Tables(env.DB);

        // 1. GET /v1/catalog/stores/:storeId/products
        if (parts.length === 2 && parts[1] === "products" && request.method === "GET") {
          const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50"), 1), 200);
          const offset = Math.max(parseInt(url.searchParams.get("offset") || "0"), 0);
          const search = (url.searchParams.get("search") || "").trim();

          let query = "SELECT * FROM products WHERE store_id = ?";
          let countQuery = "SELECT COUNT(*) as total FROM products WHERE store_id = ?";
          const params: any[] = [storeId];
          const countParams: any[] = [storeId];

          if (search) {
            query += " AND (title LIKE ? OR sku LIKE ? OR external_id LIKE ?)";
            countQuery += " AND (title LIKE ? OR sku LIKE ? OR external_id LIKE ?)";
            const term = `%${search}%`;
            params.push(term, term, term);
            countParams.push(term, term, term);
          }

          query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
          params.push(limit, offset);

          const [rowsRes, countRes] = await Promise.all([
            env.DB.prepare(query)
              .bind(...params)
              .all(),
            env.DB.prepare(countQuery)
              .bind(...countParams)
              .first(),
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

        // 2. GET /v1/catalog/stores/:storeId/sync-runs
        if (parts.length === 2 && parts[1] === "sync-runs" && request.method === "GET") {
          const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "20"), 1), 100);
          const offset = Math.max(parseInt(url.searchParams.get("offset") || "0"), 0);
          const statusFilter = (url.searchParams.get("status") || "").trim();

          let query = "SELECT * FROM sync_runs WHERE store_id = ?";
          let countQuery = "SELECT COUNT(*) as total FROM sync_runs WHERE store_id = ?";
          const params: any[] = [storeId];
          const countParams: any[] = [storeId];

          if (statusFilter) {
            query += " AND status = ?";
            countQuery += " AND status = ?";
            params.push(statusFilter);
            countParams.push(statusFilter);
          }

          query += " ORDER BY started_at DESC LIMIT ? OFFSET ?";
          params.push(limit, offset);

          const [rowsRes, countRes] = await Promise.all([
            env.DB.prepare(query)
              .bind(...params)
              .all(),
            env.DB.prepare(countQuery)
              .bind(...countParams)
              .first(),
          ]);

          const runs = (rowsRes.results || []).map((row: any) => ({
            id: row.id,
            storeId: row.store_id,
            status: row.status,
            trigger: row.trigger,
            requestedLimit: Number(row.requested_limit) || 0,
            discovered: Number(row.discovered) || 0,
            created: Number(row.created) || 0,
            updated: Number(row.updated) || 0,
            unchanged: Number(row.unchanged) || 0,
            failed: Number(row.failed) || 0,
            durationMs: Number(row.duration_ms) || 0,
            errorMessage: row.error_message || null,
            startedAt: row.started_at,
            finishedAt: row.finished_at,
            createdAt: row.created_at,
          }));

          return new Response(
            JSON.stringify({
              success: true,
              runs,
              total: countRes?.total || runs.length,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        // 3. GET /v1/catalog/stores/:storeId/sync-runs/:runId
        if (parts.length === 3 && parts[1] === "sync-runs" && request.method === "GET") {
          const runId = decodeURIComponent(parts[2] || "");
          const run = await env.DB.prepare("SELECT * FROM sync_runs WHERE store_id = ? AND id = ?")
            .bind(storeId, runId)
            .first();

          if (!run) {
            return new Response(
              JSON.stringify({ success: false, error: "Execução não encontrada." }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              run: {
                id: run.id,
                storeId: run.store_id,
                status: run.status,
                trigger: run.trigger,
                requestedLimit: Number(run.requested_limit) || 0,
                discovered: Number(run.discovered) || 0,
                created: Number(run.created) || 0,
                updated: Number(run.updated) || 0,
                unchanged: Number(run.unchanged) || 0,
                failed: Number(run.failed) || 0,
                durationMs: Number(run.duration_ms) || 0,
                errorMessage: run.error_message || null,
                startedAt: run.started_at,
                finishedAt: run.finished_at,
                createdAt: run.created_at,
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        // 4. GET /v1/catalog/stores/:storeId/status (Consolidated Operational Status)
        if (parts.length === 2 && parts[1] === "status" && request.method === "GET") {
          const store = await env.DB.prepare("SELECT * FROM stores WHERE id = ?")
            .bind(storeId)
            .first();

          if (!store) {
            return new Response(JSON.stringify({ success: false, error: "Loja não encontrada." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const [recentRunsRes, lastSuccessRes, lastFailedRes] = await Promise.all([
            env.DB.prepare(
              "SELECT * FROM sync_runs WHERE store_id = ? ORDER BY started_at DESC LIMIT 5",
            )
              .bind(storeId)
              .all(),
            env.DB.prepare(
              "SELECT started_at FROM sync_runs WHERE store_id = ? AND status IN ('success', 'partial') ORDER BY started_at DESC LIMIT 1",
            )
              .bind(storeId)
              .first(),
            env.DB.prepare(
              "SELECT started_at FROM sync_runs WHERE store_id = ? AND status = 'error' ORDER BY started_at DESC LIMIT 1",
            )
              .bind(storeId)
              .first(),
          ]);

          const recentRuns = (recentRunsRes.results || []).map((row: any) => ({
            id: row.id,
            storeId: row.store_id,
            status: row.status,
            trigger: row.trigger,
            requestedLimit: Number(row.requested_limit) || 0,
            discovered: Number(row.discovered) || 0,
            created: Number(row.created) || 0,
            updated: Number(row.updated) || 0,
            unchanged: Number(row.unchanged) || 0,
            failed: Number(row.failed) || 0,
            durationMs: Number(row.duration_ms) || 0,
            errorMessage: row.error_message || null,
            startedAt: row.started_at,
            finishedAt: row.finished_at,
            createdAt: row.created_at,
          }));

          // Derive health accurately
          let health: "healthy" | "syncing" | "degraded" | "error" | "never_synced" = "healthy";
          if (store.sync_state === "running") {
            health = "syncing";
          } else if (
            store.sync_state === "error" ||
            (recentRuns[0]?.status === "error" && !lastSuccessRes)
          ) {
            health = "error";
          } else if (recentRuns[0]?.status === "partial" || recentRuns[0]?.status === "error") {
            health = "degraded";
          } else if (Number(store.product_count) === 0 && !lastSuccessRes) {
            health = "never_synced";
          }

          return new Response(
            JSON.stringify({
              success: true,
              store: {
                id: store.id,
                name: store.name,
                username: store.username,
                source: store.source,
                shopId: store.shop_id,
                status: store.status,
                syncState: store.sync_state,
                productCount: Number(store.product_count) || 0,
                lastSyncAt: store.last_sync_at,
                lastSyncStatus: store.last_sync_status,
              },
              syncState: store.sync_state,
              lastSync: store.last_sync_at,
              lastSuccessfulSync: lastSuccessRes?.started_at || null,
              lastFailedSync: lastFailedRes?.started_at || null,
              totalProducts: Number(store.product_count) || 0,
              active: store.status === "active",
              health,
              recentRuns,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        // 5. POST /v1/catalog/stores/:storeId/refresh (Atomic Sync Engine & History Logging)
        if (parts.length === 2 && parts[1] === "refresh" && request.method === "POST") {
          const body: any = await request.json().catch(() => ({}));
          const rawLimit = body.limit !== undefined ? Number(body.limit) : 10;
          const allowedLimits = [1, 10, 50, 100];

          if (!allowedLimits.includes(rawLimit)) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Limite inválido. Valores permitidos: 1, 10, 50, 100.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Check if store exists and is active
          const store = await env.DB.prepare("SELECT * FROM stores WHERE id = ?")
            .bind(storeId)
            .first();
          if (!store) {
            return new Response(JSON.stringify({ success: false, error: "Loja não encontrada." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (store.status !== "active") {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Loja inativa. Ative a loja para sincronizar.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Atomic Lock: only succeeds if sync_state != 'running'
          const lockRes = await env.DB.prepare(
            `UPDATE stores
             SET sync_state = 'running', updated_at = datetime('now')
             WHERE id = ? AND status = 'active' AND (sync_state IS NULL OR sync_state != 'running')`,
          )
            .bind(storeId)
            .run();

          const changes = lockRes?.meta?.changes ?? lockRes?.changes ?? 0;
          if (changes === 0) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Sincronização já está em andamento para esta loja.",
                status: 409,
              }),
              { status: 409, headers: { "Content-Type": "application/json" } },
            );
          }

          const syncRunId = crypto.randomUUID();
          const startTime = Date.now();

          // Create sync_run record with 'running' status
          await env.DB.prepare(
            `INSERT INTO sync_runs (id, store_id, status, trigger, requested_limit, started_at, created_at)
             VALUES (?, ?, 'running', ?, ?, datetime('now'), datetime('now'))`,
          )
            .bind(syncRunId, storeId, body.trigger || "manual", rawLimit)
            .run();

          try {
            let storeUrl = "";
            try {
              const meta = JSON.parse(store.metadata || "{}");
              if (meta.url) storeUrl = meta.url;
            } catch {
              // ignore
            }

            if (!storeUrl) {
              storeUrl = store.username
                ? `https://shopee.com.br/${store.username}`
                : `https://shopee.com.br/shop/${store.shop_id}`;
            }

            const scrapeResult = await scrapeShopeeItems(env, storeUrl, rawLimit);

            if (!scrapeResult.success) {
              throw new Error(scrapeResult.error || "Falha na extração de itens");
            }

            const masterCatalog = await persistToD1(
              env.DB,
              scrapeResult.shopId || store.shop_id,
              scrapeResult.username || store.username,
              scrapeResult.items,
              store.name,
            );

            const durationMs = Date.now() - startTime;
            const finalStatus = masterCatalog.failed > 0 ? "partial" : "success";

            // Update sync_run to success/partial
            await env.DB.prepare(
              `UPDATE sync_runs
               SET status = ?, discovered = ?, created = ?, updated = ?, unchanged = ?, failed = ?, duration_ms = ?, finished_at = datetime('now')
               WHERE id = ?`,
            )
              .bind(
                finalStatus,
                scrapeResult.items.length,
                masterCatalog.created,
                masterCatalog.updated,
                masterCatalog.unchanged,
                masterCatalog.failed,
                durationMs,
                syncRunId,
              )
              .run();

            return new Response(
              JSON.stringify({
                success: true,
                syncRunId,
                message: "Sincronização realizada com sucesso",
                sync: {
                  syncRunId,
                  productsFound: scrapeResult.items.length,
                  created: masterCatalog.created,
                  updated: masterCatalog.updated,
                  unchanged: masterCatalog.unchanged || 0,
                  failed: masterCatalog.failed || 0,
                  provider: "shopee",
                  duration: durationMs,
                  durationMs,
                },
              }),
              { headers: { "Content-Type": "application/json" } },
            );
          } catch (syncErr: any) {
            const durationMs = Date.now() - startTime;

            // Revert state on error
            await env.DB.prepare(
              `UPDATE stores
               SET sync_state = 'error', last_sync_status = 'failed', updated_at = datetime('now')
               WHERE id = ?`,
            )
              .bind(storeId)
              .run();

            // Update sync_run to error
            await env.DB.prepare(
              `UPDATE sync_runs
               SET status = 'error', duration_ms = ?, error_message = ?, finished_at = datetime('now')
               WHERE id = ?`,
            )
              .bind(durationMs, syncErr.message || "Falha desconhecida", syncRunId)
              .run();

            return new Response(
              JSON.stringify({
                success: false,
                error: syncErr.message || "Falha durante a sincronização da loja.",
                syncRunId,
              }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }
        }

        // 6. GET /v1/catalog/stores/:storeId (Single Store Detail)
        if (parts.length === 1 && request.method === "GET") {
          const store = await env.DB.prepare("SELECT * FROM stores WHERE id = ?")
            .bind(storeId)
            .first();
          if (!store) {
            return new Response(JSON.stringify({ success: false, error: "Loja não encontrada." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              store: {
                id: store.id,
                name: store.name,
                username: store.username,
                source: store.source,
                shopId: store.shop_id,
                status: store.status,
                syncState: store.sync_state,
                productCount: Number(store.product_count) || 0,
                lastSyncAt: store.last_sync_at,
                lastSyncStatus: store.last_sync_status,
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        // 7. PATCH /v1/catalog/stores/:storeId (Activate / Deactivate Store)
        if (parts.length === 1 && request.method === "PATCH") {
          const body: any = await request.json().catch(() => ({}));
          const newStatus = body.status === "inactive" ? "inactive" : "active";

          const updateRes = await env.DB.prepare(
            "UPDATE stores SET status = ?, updated_at = datetime('now') WHERE id = ?",
          )
            .bind(newStatus, storeId)
            .run();

          const changes = updateRes?.meta?.changes ?? updateRes?.changes ?? 0;
          if (changes === 0) {
            return new Response(JSON.stringify({ success: false, error: "Loja não encontrada." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const store = await env.DB.prepare("SELECT * FROM stores WHERE id = ?")
            .bind(storeId)
            .first();

          return new Response(
            JSON.stringify({
              success: true,
              store: {
                id: store.id,
                name: store.name,
                username: store.username,
                source: store.source,
                shopId: store.shop_id,
                status: store.status,
                syncState: store.sync_state,
                productCount: Number(store.product_count) || 0,
                lastSyncAt: store.last_sync_at,
                lastSyncStatus: store.last_sync_status,
              },
              message: `Status da loja atualizado para ${newStatus}`,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }
      }

      // ----------------------------------------------------
      // GLOBAL CATALOG PRODUCTS & STATS ROUTES
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
          env.DB.prepare(query)
            .bind(...params)
            .all(),
          env.DB.prepare(countQuery)
            .bind(...countParams)
            .first(),
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
        const [prodCount, storeCount, activeCount, errorCount] = await Promise.all([
          env.DB.prepare("SELECT COUNT(*) as total FROM products").first(),
          env.DB.prepare("SELECT COUNT(*) as total FROM stores").first(),
          env.DB.prepare("SELECT COUNT(*) as total FROM stores WHERE status = 'active'").first(),
          env.DB.prepare("SELECT COUNT(*) as total FROM stores WHERE sync_state = 'error'").first(),
        ]);

        const products = prodCount?.total || 0;
        const stores = storeCount?.total || 0;
        const activeStores = activeCount?.total || 0;
        const errorStores = errorCount?.total || 0;

        return new Response(
          JSON.stringify({
            success: true,
            stats: {
              products,
              stores,
              activeStores,
              errorStores,
              sources: { shopee: { products, stores } },
              sync: {
                idle: stores - activeStores,
                running: 0,
                success: activeStores,
                partial: 0,
                error: errorStores,
              },
            },
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      // Direct Ingestion Flow
      if (url.pathname === "/ingestion/shopee" && request.method === "POST") {
        try {
          const body: any = await request.json();
          const targetUrl = body.url;
          const limit = Math.min(Math.max(parseInt(body.limit || "1"), 1), 100);

          if (!targetUrl) {
            return new Response(JSON.stringify({ success: false, errors: ["URL is required"] }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!isAllowedTargetUrl(targetUrl)) {
            return new Response(
              JSON.stringify({
                success: false,
                errors: ["Forbidden: URL is not an allowed Shopee target"],
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const scrapeResult = await scrapeShopeeItems(env, targetUrl, limit);

          if (!scrapeResult.success) {
            return new Response(
              JSON.stringify({
                success: false,
                source: "shopee",
                shopId: null,
                items: [],
                metadata: scrapeResult.metadata,
                errors: [scrapeResult.error || "unable to resolve Shopee ShopID"],
              }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          const masterCatalog = await persistToD1(
            env.DB,
            scrapeResult.shopId || "",
            scrapeResult.username || "",
            scrapeResult.items,
          );

          return new Response(
            JSON.stringify({
              success: true,
              source: "shopee",
              shopId: scrapeResult.shopId,
              items: scrapeResult.items,
              masterCatalog,
              metadata: scrapeResult.metadata,
              errors: [],
            }),
            { headers: { "Content-Type": "application/json" } },
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

      return new Response("Not Found", { status: 404 });
    };

    const response = await handleRequest();
    const newResponse = new Response(response.body, response);
    Object.entries(corsHeaders).forEach(([name, value]) => {
      newResponse.headers.set(name, value);
    });

    return newResponse;
  },
};
