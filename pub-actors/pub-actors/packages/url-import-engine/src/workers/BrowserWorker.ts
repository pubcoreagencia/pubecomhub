import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/Matheus Paes/pubecomhub/node_modules/playwright");
import { BrowserCollectorOutput } from "../../../browser-collector/src/BrowserCollector.js";

export interface BrowserWorkerResult {
  success: boolean;
  collectorOutput: BrowserCollectorOutput | null;
  durationMs: number;
  error?: string;
}

export class BrowserWorker {
  private static CHROME_EXECUTABLE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  /**
   * Executes headless browser session, renders page and collects product data
   */
  static async renderAndCollect(url: string, timeoutMs = 25000): Promise<BrowserWorkerResult> {
    const startTime = Date.now();
    let browser: any = null;

    try {
      browser = await chromium.launch({
        executablePath: this.CHROME_EXECUTABLE,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });

      const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        viewport: { width: 1280, height: 800 },
      });

      const page = await context.newPage();
      page.setDefaultTimeout(timeoutMs);

      // Navigate to target URL
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
      if (!response) {
        throw new Error("Página não respondeu à requisição");
      }

      const status = response.status();
      if (status >= 400) {
        throw new Error(`Servidor remoto retornou HTTP ${status}`);
      }

      // Allow brief hydration window
      await page.waitForTimeout(1500);

      // Execute in-page extraction
      const rawExtraction = await page.evaluate((targetUrl: string) => {
        const doc = document;
        const win = window as any;

        // Title
        const titleEl = doc.querySelector("h1.ui-pdp-title, h1#title, h1#productTitle, .shopee-product-detail h1, h1");
        const title = titleEl ? (titleEl as HTMLElement).innerText.trim() : null;

        // Price
        let price: number | null = null;
        const mlFrac = doc.querySelector(".andes-money-amount__fraction");
        if (mlFrac) {
          const raw = (mlFrac as HTMLElement).innerText.trim();
          const cents = (doc.querySelector(".andes-money-amount__cents") as HTMLElement)?.innerText.replace(/[^0-9]/g, "") || "00";
          if (raw.includes(".")) price = parseFloat(raw.replace(/,/g, ""));
          else price = parseFloat(`${raw.replace(/\./g, "")}.${cents}`);
        }

        if (!price) {
          const shopeePrice = doc.querySelector(".pqTWkA, .Y3d2A, [class*='shopee-price']");
          if (shopeePrice) {
            const m = (shopeePrice as HTMLElement).innerText.replace(/\./g, "").replace(",", ".").match(/[\d.]+/);
            if (m) price = parseFloat(m[0]);
          }
        }

        if (!price) {
          const amzWhole = doc.querySelector(".a-price-whole");
          if (amzWhole) {
            const amzFrac = doc.querySelector(".a-price-fraction");
            const w = (amzWhole as HTMLElement).innerText.replace(/[^0-9]/g, "");
            const f = amzFrac ? (amzFrac as HTMLElement).innerText.replace(/[^0-9]/g, "") : "00";
            price = parseFloat(`${w}.${f}`);
          }
        }

        // Images
        const images: string[] = [];
        const imgEls = doc.querySelectorAll(".ui-pdp-gallery__figure img, #imgTagWrapperId img, #landingImage, .shopee-product-detail img, img[data-zoom]");
        imgEls.forEach((el) => {
          const src = el.getAttribute("data-zoom") || el.getAttribute("data-old-hires") || (el as HTMLImageElement).src;
          if (src && src.startsWith("http") && !src.includes("placeholder") && !src.includes("data:image")) {
            if (!images.includes(src)) images.push(src);
          }
        });

        // JSON-LD
        let jsonldTitle: string | null = null;
        let jsonldPrice: number | null = null;
        let jsonldBrand: string | null = null;
        let jsonldDesc: string | null = null;

        const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
        scripts.forEach((s) => {
          try {
            const parsed = JSON.parse(s.textContent || "");
            const items = Array.isArray(parsed) ? parsed : [parsed];
            for (const item of items) {
              if (item["@type"] === "Product" || item.name) {
                if (item.name && !jsonldTitle) jsonldTitle = item.name;
                if (item.description && !jsonldDesc) jsonldDesc = item.description;
                if (item.brand?.name && !jsonldBrand) jsonldBrand = item.brand.name;
                if (item.offers) {
                  const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
                  if (offer?.price && !jsonldPrice) jsonldPrice = parseFloat(offer.price);
                }
              }
            }
          } catch {}
        });

        // Hydration State
        let hydTitle: string | null = null;
        let hydPrice: number | null = null;
        if (win.__UNIVERSAL_DATA_FOR_REHYDRATION__?.productInfo) {
          hydTitle = win.__UNIVERSAL_DATA_FOR_REHYDRATION__.productInfo.title || null;
          hydPrice = parseFloat(win.__UNIVERSAL_DATA_FOR_REHYDRATION__.productInfo.price) || null;
        }

        return {
          title: title || jsonldTitle || hydTitle,
          titleSource: title ? "dom" : jsonldTitle ? "jsonld" : hydTitle ? "hydration" : "unknown",
          price: price || jsonldPrice || hydPrice,
          priceSource: price ? "dom" : jsonldPrice ? "jsonld" : hydPrice ? "hydration" : "unknown",
          images,
          brand: jsonldBrand,
          description: jsonldDesc,
        };
      }, url);

      await context.close();
      await browser.close();

      const durationMs = Date.now() - startTime;
      const isComplete = Boolean(rawExtraction.title && rawExtraction.price && rawExtraction.images.length > 0);

      return {
        success: isComplete,
        collectorOutput: {
          status: isComplete ? "SUCCESS" : "INCOMPLETE",
          marketplace: "browser_rendered",
          url,
          productId: "ITEM_1",
          shopId: null,
          durationMs,
          auditedProduct: {
            source: { value: "browser_rendered", source: "dom" },
            sourceUrl: { value: url, source: "dom" },
            externalId: { value: "ITEM_1", source: "dom" },
            title: { value: rawExtraction.title, source: rawExtraction.titleSource as any },
            price: { value: rawExtraction.price, source: rawExtraction.priceSource as any },
            currency: { value: "BRL", source: "dom" },
            images: { value: rawExtraction.images, source: "dom" },
            description: { value: rawExtraction.description, source: "jsonld" },
            brand: { value: rawExtraction.brand, source: "jsonld" },
            totalRealFields: [rawExtraction.title, rawExtraction.price, rawExtraction.images.length > 0].filter(Boolean).length,
            isComplete,
          },
          canonicalProduct: null,
          sourcesFound: { dom: true, jsonld: true, meta: false, hydration: true, network: false },
          totalRealFields: 3,
        },
        durationMs,
      };
    } catch (err: any) {
      if (browser) await browser.close().catch(() => {});
      return {
        success: false,
        collectorOutput: null,
        durationMs: Date.now() - startTime,
        error: err.message || String(err),
      };
    }
  }
}
