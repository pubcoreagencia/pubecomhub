// @ts-ignore
import { chromium } from 'playwright-core';

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
        console.log(`[Worker] Starting browser ingestion for: ${targetUrl}`);

        // 5. Browser Run Execution
        const browser = await chromium.launch(env.BROWSER);
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
          
          // Lógica de extração Shopee real seria aqui
          
          return new Response(JSON.stringify({
            success: true,
            source: 'shopee',
            shopId: 'detected_id_placeholder',
            items: [],
            metadata: {
              pagesProcessed: 1,
              totalFound: 0,
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
