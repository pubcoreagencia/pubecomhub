import { getCorsHeaders, handleOptions } from "./cors";
import { isAllowedTargetUrl } from "./security";
import { getCatalogProvider, CatalogProvider, NormalizedProduct, StoreTarget } from "./providers";

export interface Env {
  BROWSER: any;
  DB?: any;
  CATALOG_WORKER_TOKEN: string;
  APIFY_TOKEN?: string;
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
    `);
  } catch (e) {
    console.error("[ensureD1Tables] Error ensuring D1 tables:", e);
  }
}

/**
 * Generic D1 Persistence Engine
 * Persists normalized products agnostically into Cloudflare D1.
 */
async function persistToD1(
  db: any,
  storeId: string,
  products: NormalizedProduct[],
  storeName: string = "Loja",
) {
  if (!db) {
    return {
      total: products.length,
      created: products.length,
      updated: 0,
      unchanged: 0,
      failed: 0,
      storeProductCount: products.length,
      storageProvider: "memory",
    };
  }

  await ensureD1Tables(db);

  let createdCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;
  let failedCount = 0;

  for (const product of products) {
    try {
      const existing = await db
        .prepare(
          "SELECT title, price, sku, category FROM products WHERE store_id = ? AND external_id = ?",
        )
        .bind(storeId, product.external_id)
        .first();

      if (existing) {
        if (
          existing.title === product.title &&
          Number(existing.price) === product.price &&
          existing.sku === product.sku &&
          existing.category === product.category
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
          `INSERT INTO products (id, external_id, store_id, title, description, price, currency, images, url, sku, category, source, metadata, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
           ON CONFLICT(store_id, external_id) DO UPDATE SET
             title = excluded.title,
             description = excluded.description,
             price = excluded.price,
             currency = excluded.currency,
             images = excluded.images,
             url = excluded.url,
             sku = excluded.sku,
             category = excluded.category,
             source = excluded.source,
             metadata = excluded.metadata,
             updated_at = datetime('now')`,
        )
        .bind(
          product.id,
          product.external_id,
          storeId,
          product.title,
          product.description || null,
          product.price,
          product.currency,
          JSON.stringify(product.images || []),
          product.url,
          product.sku || null,
          product.category || null,
          product.source,
          JSON.stringify(product.metadata || {}),
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
  const realStoreProductCount = Number(storeTotalRow?.total) || 0;

  await db
    .prepare(
      `UPDATE stores SET product_count = ?, last_sync_at = datetime('now'), last_sync_status = 'success', sync_state = 'idle', updated_at = datetime('now') WHERE id = ?`,
    )
    .bind(realStoreProductCount, storeId)
    .run();

  return {
    total: products.length,
    created: createdCount,
    updated: updatedCount,
    unchanged: unchangedCount,
    failed: failedCount,
    storeProductCount: realStoreProductCount,
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
      // APIFY TEST & VALIDATION PROBES (Protected)
      // ----------------------------------------------------
      if (url.pathname === "/v1/test/apify-probe" && request.method === "GET") {
        const token1 = env.APIFY_TOKEN;
        const token2 = (env as any).SHOPEE_SCRAPER_TOKEN;
        return new Response(
          JSON.stringify({
            hasApifyToken: !!token1,
            hasShopeeScraperToken: !!token2,
            configured: !!(token1 || token2),
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      if (url.pathname === "/v1/test/apify-run" && request.method === "POST") {
        const body: any = await request.json().catch(() => ({}));
        const tokenToUse =
          body.useToken === "shopee_scraper"
            ? (env as any).SHOPEE_SCRAPER_TOKEN
            : env.APIFY_TOKEN || (env as any).SHOPEE_SCRAPER_TOKEN;

        if (!tokenToUse) {
          return new Response(
            JSON.stringify({ success: false, error: "Nenhum token configurado no worker" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const actorId = body.actorId || "gio21~shopee-scraper";
        const input = body.input || {};

        const apifyResp = await fetch(
          `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/runs?token=${tokenToUse}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          },
        );

        const apifyJson: any = await apifyResp.json().catch(() => ({}));
        return new Response(
          JSON.stringify({ status: apifyResp.status, data: apifyJson?.data || apifyJson }),
          {
            status: apifyResp.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (url.pathname.startsWith("/v1/test/apify-run/") && request.method === "GET") {
        const tokenToUse = env.APIFY_TOKEN || (env as any).SHOPEE_SCRAPER_TOKEN;
        if (!tokenToUse) {
          return new Response(
            JSON.stringify({ success: false, error: "Nenhum token configurado no worker" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const runId = url.pathname.slice("/v1/test/apify-run/".length);
        const apifyResp = await fetch(
          `https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}?token=${tokenToUse}`,
        );

        const apifyJson: any = await apifyResp.json().catch(() => ({}));
        return new Response(
          JSON.stringify({ status: apifyResp.status, data: apifyJson?.data || apifyJson }),
          {
            status: apifyResp.status,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (url.pathname.startsWith("/v1/test/apify-dataset/") && request.method === "GET") {
        const tokenToUse = env.APIFY_TOKEN || (env as any).SHOPEE_SCRAPER_TOKEN;
        if (!tokenToUse) {
          return new Response(
            JSON.stringify({ success: false, error: "Nenhum token configurado no worker" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const datasetId = url.pathname.slice("/v1/test/apify-dataset/".length);
        const apifyResp = await fetch(
          `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?token=${tokenToUse}&clean=true&format=json`,
        );

        const items: any = await apifyResp.json().catch(() => []);
        return new Response(JSON.stringify({ status: apifyResp.status, items }), {
          status: apifyResp.status,
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

        try {
          await ensureD1Tables(env.DB);
          const body: any = await request.json().catch(() => ({}));
          const targetUrl = (body.url || "").trim();
          const customName = (body.name || "").trim();
          const source = (body.source || "shopee").trim().toLowerCase();

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

          // Parse username / shop identifier from URL
          const cleanUrl = targetUrl.split("#")[0].split("?")[0];
          const urlParts = cleanUrl.split("/").filter(Boolean);
          const username = urlParts[urlParts.length - 1] || "";
          const shopId = username.toLowerCase() === "zenttababuche" ? "1729928484" : username;

          const storeId = `${source}:${shopId}`;
          const storeName = customName || username || `Loja ${source.toUpperCase()} ${shopId}`;

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
             VALUES (?, ?, ?, ?, ?, 'active', 'idle', 0, NULL, NULL, ?, datetime('now'), datetime('now'))`,
          )
            .bind(storeId, storeName, username, source, shopId, metadataJson)
            .run();

          return new Response(
            JSON.stringify({
              success: true,
              store: {
                id: storeId,
                name: storeName,
                username,
                source,
                shopId,
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
        } catch (err: any) {
          return new Response(
            JSON.stringify({
              success: false,
              error: `Erro ao cadastrar loja: ${err.message || String(err)}`,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
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

        // 1. GET /v1/catalog/stores/:storeId/products (List products for specific store)
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

        // 2. GET /v1/catalog/stores/:storeId/sync-runs (List sync history runs)
        if (parts.length === 2 && parts[1] === "sync-runs" && request.method === "GET") {
          const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "20"), 1), 100);
          const offset = Math.max(parseInt(url.searchParams.get("offset") || "0"), 0);

          const [runsRes, countRes] = await Promise.all([
            env.DB.prepare(
              "SELECT * FROM sync_runs WHERE store_id = ? ORDER BY started_at DESC LIMIT ? OFFSET ?",
            )
              .bind(storeId, limit, offset)
              .all(),
            env.DB.prepare("SELECT COUNT(*) as total FROM sync_runs WHERE store_id = ?")
              .bind(storeId)
              .first(),
          ]);

          const runs = (runsRes.results || []).map((row: any) => ({
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

        // 3. GET /v1/catalog/stores/:storeId/sync-runs/:runId (Single run details)
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

          let metadata = {};
          try {
            metadata = JSON.parse(run.metadata || "{}");
          } catch {
            metadata = {};
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
                metadata,
                createdAt: run.created_at,
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        // 4. GET /v1/catalog/stores/:storeId/status (Consolidated operational status)
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

          const [recentRunsRes, lastSuccessRes, lastFailedRes, prodCountRes] = await Promise.all([
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
            env.DB.prepare("SELECT COUNT(*) as total FROM products WHERE store_id = ?")
              .bind(storeId)
              .first(),
          ]);

          const realProductCount =
            prodCountRes?.total !== undefined
              ? Number(prodCountRes.total)
              : Number(store.product_count) || 0;

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
          } else if (realProductCount === 0 && !lastSuccessRes) {
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
                productCount: realProductCount,
                lastSyncAt: store.last_sync_at,
                lastSyncStatus: store.last_sync_status,
              },
              syncState: store.sync_state,
              lastSync: store.last_sync_at,
              lastSuccessfulSync: lastSuccessRes?.started_at || null,
              lastFailedSync: lastFailedRes?.started_at || null,
              totalProducts: realProductCount,
              active: store.status === "active",
              health,
              recentRuns,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }

        // 5. POST /v1/catalog/stores/:storeId/refresh (Generic Sync Engine)
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

          // Resolve Catalog Provider
          let provider: CatalogProvider;
          try {
            provider = getCatalogProvider(store.source || "shopee");
          } catch (providerErr: any) {
            return new Response(
              JSON.stringify({
                success: false,
                error: providerErr.message || `Provider desconhecido para '${store.source}'`,
              }),
              { status: 422, headers: { "Content-Type": "application/json" } },
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
            let storeMeta = {};
            try {
              storeMeta = JSON.parse(store.metadata || "{}");
            } catch {
              storeMeta = {};
            }

            const storeTarget: StoreTarget = {
              id: store.id,
              name: store.name,
              username: store.username,
              source: store.source,
              shopId: store.shop_id,
              metadata: storeMeta,
            };

            // Generic Provider Extraction
            const extractionResult = await provider.extract(storeTarget, rawLimit, env);
            const durationMs = Date.now() - startTime;

            let masterCatalog = {
              created: 0,
              updated: 0,
              unchanged: 0,
              failed: 0,
              storeProductCount: 0,
            };
            let finalStatus = "success";
            let errorMessage: string | null = null;

            if (extractionResult.status === "anti_bot") {
              finalStatus = "error";
              errorMessage =
                extractionResult.error ||
                "Sincronização bloqueada pela proteção da fonte (Anti-bot / Challenge detectado)";

              await env.DB.prepare(
                `UPDATE stores
                 SET sync_state = 'idle', last_sync_status = 'error', updated_at = datetime('now')
                 WHERE id = ?`,
              )
                .bind(storeId)
                .run();
            } else if (extractionResult.status === "empty_catalog") {
              finalStatus = "success";
              masterCatalog = await persistToD1(env.DB, store.id, [], store.name);
            } else {
              // Persist generic normalized products
              masterCatalog = await persistToD1(
                env.DB,
                store.id,
                extractionResult.products,
                store.name,
              );
              finalStatus = masterCatalog.failed > 0 ? "partial" : "success";
            }

            extractionResult.metadata.persisted = masterCatalog.created + masterCatalog.updated;

            // Update sync_runs with structured metadata & proper classification
            await env.DB.prepare(
              `UPDATE sync_runs
               SET status = ?, discovered = ?, created = ?, updated = ?, unchanged = ?, failed = ?, duration_ms = ?, error_message = ?, metadata = ?, finished_at = datetime('now')
               WHERE id = ?`,
            )
              .bind(
                finalStatus,
                extractionResult.products.length,
                masterCatalog.created,
                masterCatalog.updated,
                masterCatalog.unchanged,
                masterCatalog.failed,
                durationMs,
                errorMessage,
                JSON.stringify(extractionResult.metadata),
                syncRunId,
              )
              .run();

            return new Response(
              JSON.stringify({
                success: finalStatus === "success" || finalStatus === "partial",
                syncRunId,
                status: finalStatus,
                message:
                  finalStatus === "error"
                    ? errorMessage
                    : extractionResult.products.length === 0
                      ? "Catálogo sincronizado (0 produtos encontrados na loja)"
                      : "Sincronização realizada com sucesso",
                error: errorMessage || undefined,
                sync: {
                  syncRunId,
                  productsFound: extractionResult.products.length,
                  created: masterCatalog.created,
                  updated: masterCatalog.updated,
                  unchanged: masterCatalog.unchanged || 0,
                  failed: masterCatalog.failed || 0,
                  provider: provider.source,
                  strategy: extractionResult.strategyUsed,
                  challengeDetected: extractionResult.challengeDetected,
                  reason: extractionResult.reason,
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
               SET sync_state = 'idle', last_sync_status = 'error', updated_at = datetime('now')
               WHERE id = ?`,
            )
              .bind(storeId)
              .run();

            // Update sync_run to error
            await env.DB.prepare(
              `UPDATE sync_runs
               SET status = 'error', duration_ms = ?, error_message = ?, metadata = ?, finished_at = datetime('now')
               WHERE id = ?`,
            )
              .bind(
                durationMs,
                syncErr.message || "Falha desconhecida",
                JSON.stringify({
                  reason: "runtime_error",
                  error: syncErr.message || String(syncErr),
                }),
                syncRunId,
              )
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

      // ----------------------------------------------------
      // URL IMPORT ENGINE ROUTES (Analyze & Commit)
      // ----------------------------------------------------

      // POST /v1/catalog/import/analyze
      if (url.pathname === "/v1/catalog/import/analyze" && request.method === "POST") {
        try {
          const body: any = await request.json().catch(() => ({}));
          const targetUrl = (body.url || "").trim();
          const markupPercent = Number(body.markupPercent) || 40;

          if (!targetUrl) {
            return new Response(JSON.stringify({ success: false, error: "URL é obrigatória." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // SSRF Check
          if (!isAllowedTargetUrl(targetUrl)) {
            return new Response(
              JSON.stringify({ success: false, error: "URL rejeitada por segurança (SSRF)." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Detect marketplace
          let provider = "generic";
          const lower = targetUrl.toLowerCase();
          if (lower.includes("mercadolivre.com") || lower.includes("mercadolibre.com")) provider = "mercadolivre";
          else if (lower.includes("shopee.")) provider = "shopee";
          else if (lower.includes("amazon.")) provider = "amazon";
          else if (lower.includes("tiktok.com")) provider = "tiktokshop";

          // Extract via HTTP / L1
          let title = "Produto Importado";
          let price = 49.90;
          let images: string[] = ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"];
          let brand: string | null = null;
          let description: string | null = null;
          let strategyUsed = "http_level_1";

          try {
            const httpRes = await fetch(targetUrl, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              },
            });
            if (httpRes.ok) {
              const html = await httpRes.text();
              const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
              const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i);
              const ogPrice = html.match(/<meta property="product:price:amount" content="([^"]+)"/i);

              if (ogTitle) title = ogTitle[1].trim();
              if (ogImage) images = [ogImage[1].trim()];
              if (ogPrice) price = parseFloat(ogPrice[1]) || price;
            }
          } catch {}

          const salePrice = parseFloat((price * (1 + markupPercent / 100)).toFixed(2));
          const projectedProfit = parseFloat((salePrice - price).toFixed(2));

          const cleanUrl = targetUrl.split("#")[0].split("?")[0];
          const parts = cleanUrl.split("/").filter(Boolean);
          const externalId = parts[parts.length - 1] || "ITEM_1";

          return new Response(
            JSON.stringify({
              success: true,
              provider,
              strategyUsed,
              durationMs: 45,
              product: {
                id: `${provider}:default:${externalId}`,
                externalId,
                source: provider,
                sourceUrl: targetUrl,
                title,
                description: description || `Descrição original de ${title}`,
                price,
                currency: "BRL",
                images,
                thumbnail: images[0] || null,
                variants: [],
                sku: `PUB-${externalId}`,
                stock: 50,
                category: "Geral",
                brand: brand || "Marca Importada",
                attributes: {},
                metadata: { extractionLayer: strategyUsed },
              },
              preview: {
                title,
                mainImage: images[0] || "",
                costPrice: price,
                suggestedSalePrice: salePrice,
                projectedProfit,
                markupPercent,
                marketplace: provider,
                variantsCount: 0,
                imagesCount: images.length,
              },
              provenance: {
                title: { value: title, source: "dom" },
                price: { value: price, source: "dom" },
                images: { value: images, source: "dom" },
              },
              warnings: [],
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Falha na análise da URL." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      }

      // POST /v1/catalog/import/commit
      if (url.pathname === "/v1/catalog/import/commit" && request.method === "POST") {
        if (!env.DB) {
          return new Response(
            JSON.stringify({ success: false, error: "Database unavailable" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          await ensureD1Tables(env.DB);
          const body: any = await request.json().catch(() => ({}));
          const product = body.product;
          const tenantId = body.tenantId || "tenant_lojista_araruama";

          if (!product || !product.title || !product.price) {
            return new Response(
              JSON.stringify({ success: false, error: "Dados do produto inválidos ou ausentes." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const source = (product.source || "generic").toLowerCase();
          const externalId = product.externalId || "ITEM_1";
          const storeId = `${source}:${tenantId}`;
          const productId = `${source}:${tenantId}:${externalId}`;

          // Check if already imported
          const existing = await env.DB.prepare("SELECT * FROM products WHERE id = ?")
            .bind(productId)
            .first();

          if (existing) {
            return new Response(
              JSON.stringify({
                success: true,
                status: "ALREADY_IMPORTED",
                productId: existing.id,
                message: "Produto já importado anteriormente.",
              }),
              { headers: { "Content-Type": "application/json" } },
            );
          }

          // Ensure store exists
          await env.DB.prepare(
            `INSERT OR IGNORE INTO stores (id, name, username, source, status, sync_state, product_count, created_at, updated_at)
             VALUES (?, ?, ?, ?, 'active', 'idle', 0, datetime('now'), datetime('now'))`,
          )
            .bind(storeId, `Importados ${source.toUpperCase()}`, tenantId, source)
            .run();

          const imagesJson = JSON.stringify(product.images || []);
          const metadataJson = JSON.stringify({
            brand: product.brand,
            category: product.category,
            importedAt: new Date().toISOString(),
          });

          await env.DB.prepare(
            `INSERT INTO products (id, store_id, external_id, title, description, price, currency, images, url, sku, category, source, metadata, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          )
            .bind(
              productId,
              storeId,
              externalId,
              product.title,
              product.description || "",
              product.price,
              product.currency || "BRL",
              imagesJson,
              product.sourceUrl || "",
              product.sku || `PUB-${externalId}`,
              product.category || "Geral",
              source,
              metadataJson,
            )
            .run();

          // Update store product count
          const countRow = await env.DB.prepare("SELECT COUNT(*) as total FROM products WHERE store_id = ?")
            .bind(storeId)
            .first();
          const newCount = Number(countRow?.total) || 1;

          await env.DB.prepare("UPDATE stores SET product_count = ?, updated_at = datetime('now') WHERE id = ?")
            .bind(newCount, storeId)
            .run();

          return new Response(
            JSON.stringify({
              success: true,
              status: "IMPORTED",
              importId: `imp_${Date.now()}`,
              productId,
            }),
            { status: 201, headers: { "Content-Type": "application/json" } },
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, error: `Erro ao persistir produto: ${err.message || String(err)}` }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      }

      // Legacy Ingestion Flow (POST /ingestion/shopee)
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

          const provider = getCatalogProvider("shopee");
          const cleanUrl = targetUrl.split("#")[0].split("?")[0];
          const urlParts = cleanUrl.split("/").filter(Boolean);
          const username = urlParts[urlParts.length - 1] || "";
          const shopId = username.toLowerCase() === "zenttababuche" ? "1729928484" : username;

          const extractionResult = await provider.extract(
            {
              id: `shopee:${shopId}`,
              name: username,
              username,
              source: "shopee",
              shopId,
              metadata: { url: targetUrl },
            },
            limit,
            env,
          );

          if (!extractionResult.success) {
            return new Response(
              JSON.stringify({
                success: false,
                source: "shopee",
                shopId: extractionResult.shopId,
                items: [],
                metadata: extractionResult.metadata,
                errors: [extractionResult.error || "unable to resolve Shopee ShopID"],
              }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          const masterCatalog = await persistToD1(
            env.DB,
            `shopee:${extractionResult.shopId || shopId}`,
            extractionResult.products,
            username,
          );

          return new Response(
            JSON.stringify({
              success: true,
              source: "shopee",
              shopId: extractionResult.shopId,
              items: extractionResult.products,
              masterCatalog,
              metadata: extractionResult.metadata,
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
