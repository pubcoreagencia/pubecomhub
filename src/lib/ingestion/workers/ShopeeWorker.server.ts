// Note: This file uses Playwright and must be executed in a Node.js environment on the server.
// TanStack Start handles the .server extension by keeping it out of the client bundle.
import { chromium } from "playwright";

interface WorkerParams {
  url: string;
  shopId?: string;
  limit: number;
  pageSize: number;
}

interface WorkerResult {
  items: any[];
  errors: string[];
  shopId: string | null;
  executionTime: number;
}

/**
 * Validates the URL to prevent SSRF
 */
function validateUrl(url: string) {
  const parsed = new URL(url);
  
  // Allow only shopee.com.br
  if (!parsed.hostname.endsWith('shopee.com.br')) {
    throw new Error("Domínio não permitido.");
  }

  // Prevent private IPs
  const blockedIps = ['127.0.0.1', '0.0.0.0', 'localhost', '169.254.169.254'];
  if (blockedIps.includes(parsed.hostname.toLowerCase())) {
    throw new Error("Origem inválida.");
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error("Protocolo não suportado.");
  }
}

export async function runShopeeWorker(params: WorkerParams): Promise<WorkerResult> {
  const startTime = Date.now();
  const { url, limit, shopId: initialShopId } = params;
  const items: any[] = [];
  const errors: string[] = [];
  let detectedShopId: string | null = initialShopId || null;

  validateUrl(url);

  console.log(`[ShopeeWorker] Starting browser automation for: ${url}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 1800 }
  });

  const page = await context.newPage();

  try {
    // 1. Navigate to the store page to establish session and intercept API calls
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // 2. Extract ShopID if not provided
    if (!detectedShopId) {
      detectedShopId = await page.evaluate(() => {
        // Try to find ShopID in window variables or meta tags
        const content = document.body.innerText;
        const match = content.match(/shopid["\s:]+(\d+)/);
        return match ? (match[1] || null) : null;
      });
    }

    if (!detectedShopId) {
      throw new Error("Não foi possível identificar o ID da loja.");
    }

    // 3. Call the internal API directly using page.evaluate to bypass some headers/cookies issues
    // We scroll or trigger requests to get products
    let offset = 0;
    while (items.length < limit) {
      console.log(`[ShopeeWorker] Fetching products for shop ${detectedShopId} at offset ${offset}`);
      
      const pageResults: any = await page.evaluate(async ({ shopId, offset }: { shopId: string, offset: number }) => {
        try {
          const api = `https://shopee.com.br/api/v4/search/search_items?by=relevancy&limit=30&match_id=${shopId}&newest=${offset}&order=desc&page_type=shop&scenario=PAGE_SHOP&version=2`;
          const response = await fetch(api);
          if (!response.ok) return { error: `HTTP ${response.status}` };
          const data = await response.json();
          return { items: data.items || [] };
        } catch (e: any) {
          return { error: e.message };
        }
      }, { shopId: detectedShopId, offset, limit: 30 });

      if (pageResults.error) {
        errors.push(`Erro na página ${offset}: ${pageResults.error}`);
        break;
      }

      const newItems = pageResults.items.map((i: any) => i.item_basic);
      if (newItems.length === 0) break;

      items.push(...newItems);
      offset += newItems.length;

      // Small delay between requests
      await new Promise(r => setTimeout(r, 1000));
    }

  } catch (error: any) {
    console.error(`[ShopeeWorker] Error:`, error);
    errors.push(error.message);
  } finally {
    await browser.close();
  }

  return {
    items: items.slice(0, limit),
    errors,
    shopId: detectedShopId,
    executionTime: Date.now() - startTime
  };
}
