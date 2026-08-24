/**
 * Shopee Ingestion Engine V2 - Recovery & Multi-Strategy Orchestrator
 *
 * Modular, multi-strategy ingestion with explicit challenge / anti-bot detection,
 * per-strategy diagnostics, and structured observability for Cloudflare D1.
 */

export type ExtractionStatus =
  | "success"
  | "empty_catalog"
  | "anti_bot"
  | "network_error"
  | "parse_error"
  | "runtime_error"
  | "source_unavailable";

export interface StrategyDiagnostic {
  strategy: string;
  url: string;
  httpStatus: number;
  durationMs: number;
  productsFound: number;
  challengeDetected: boolean;
  reason: string;
}

export interface ChallengeDetectionResult {
  isChallenge: boolean;
  reason: string;
}

export interface NormalizedProduct {
  id: string; // `${storeId}:${externalId}`
  external_id: string;
  store_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  url: string;
  sku: string | null;
  category: string | null;
  source: string;
  metadata?: Record<string, any>;
}

export interface IngestionEngineResult {
  success: boolean;
  status: ExtractionStatus;
  shopId: string | null;
  username: string;
  items: any[];
  normalizedProducts: NormalizedProduct[];
  strategyUsed: string;
  attempts: number;
  challengeDetected: boolean;
  reason: ExtractionStatus;
  error?: string;
  metadata: {
    provider: "cloudflare-browser-run";
    source: "shopee";
    shopId: string | null;
    strategy: string;
    attempts: number;
    challengeDetected: boolean;
    reason: ExtractionStatus;
    discovered: number;
    persisted: number;
    executionTimeMs: number;
    finalPageUrl?: string;
    details?: string;
    strategies: StrategyDiagnostic[];
  };
}

/**
 * Explicit detection of Shopee anti-bot / traffic challenges.
 */
export function detectShopeeChallenge(
  url: string,
  html: string = "",
  title: string = "",
  apiStatus: number = 200,
  apiJson: any = null,
): ChallengeDetectionResult {
  const urlLower = (url || "").toLowerCase();
  const htmlLower = (html || "").toLowerCase();
  const titleLower = (title || "").toLowerCase();

  // 1. URL patterns
  if (
    urlLower.includes("/verify/") ||
    urlLower.includes("/traffic/error") ||
    urlLower.includes("verify/traffic") ||
    urlLower.includes("sec-cpt") ||
    urlLower.includes("captcha")
  ) {
    return { isChallenge: true, reason: `URL de challenge detectada: ${url}` };
  }

  // 2. Title patterns
  if (
    titleLower.includes("robot") ||
    titleLower.includes("verification") ||
    titleLower.includes("traffic error") ||
    titleLower.includes("página indisponível") ||
    titleLower.includes("access denied") ||
    titleLower.includes("verificação de segurança")
  ) {
    return { isChallenge: true, reason: `Título de proteção detectado: ${title}` };
  }

  // 3. HTML signatures
  if (
    htmlLower.includes("verify/traffic/error") ||
    htmlLower.includes("geetest") ||
    htmlLower.includes("shopee-challenge") ||
    htmlLower.includes("challenge-form") ||
    htmlLower.includes("traffic-error") ||
    htmlLower.includes("shopee-verify")
  ) {
    return { isChallenge: true, reason: "Assinatura HTML de proteção anti-bot detectada." };
  }

  // 4. API Specific error codes (e.g. 90309999, 403 Forbidden with challenge)
  if (apiJson) {
    if (apiJson.error === 90309999 || apiJson["3"] === 90309999) {
      return { isChallenge: true, reason: "Shopee API Anti-Bot error code 90309999" };
    }
    if (apiJson.error === "ERR_CHALLENGE" || apiJson.error === "ERR_ROBOT") {
      return { isChallenge: true, reason: `API response challenge: ${apiJson.error}` };
    }
  }

  if (apiStatus === 403 || apiStatus === 429) {
    return { isChallenge: true, reason: `Status HTTP ${apiStatus} bloqueado pelo upstream` };
  }

  return { isChallenge: false, reason: "" };
}

/**
 * Normalization helper: ensures clean schema fields for D1 persistence
 */
export function normalizeShopeeProduct(
  raw: any,
  storeId: string,
  shopId: string,
): NormalizedProduct {
  const item = raw.item_basic || raw;
  const externalId = String(item.itemid || item.id || item.itemId || "").trim();
  const title = String(item.name || item.title || `Produto ${externalId}`).trim();
  const rawPrice = item.price !== undefined ? Number(item.price) : 0;
  // Shopee micro-units (e.g. 2990000 = 29.90 BRL)
  const price = rawPrice > 10000 ? rawPrice / 100000 : rawPrice;
  const currency = item.currency || "BRL";

  let images: string[] = [];
  if (Array.isArray(item.images)) {
    images = item.images.filter(Boolean);
  } else if (item.image) {
    images = [item.image];
  }

  const url =
    item.url ||
    (externalId
      ? `https://shopee.com.br/product/${shopId}/${externalId}`
      : `https://shopee.com.br/shop/${shopId}`);

  const sku = item.sku ? String(item.sku).trim() : null;
  const category = item.category ? String(item.category).trim() : null;
  const description = item.description ? String(item.description).trim() : null;

  return {
    id: `${storeId}:${externalId}`,
    external_id: externalId,
    store_id: storeId,
    title,
    description,
    price,
    currency,
    images,
    url,
    sku,
    category,
    source: "shopee",
    metadata: {
      rawShopId: shopId,
      rawItemId: externalId,
    },
  };
}

/**
 * Strategy: Extract products from JSON-LD script blocks
 */
export function extractFromJsonLd(scriptsText: string[]): any[] {
  const items: any[] = [];
  for (const text of scriptsText) {
    try {
      const data = JSON.parse(text || "{}");
      if (data["@type"] === "Product") {
        items.push({
          item_basic: {
            itemid: data.sku || data.productID || data.name,
            name: data.name,
            price: data.offers?.price ? Number(data.offers.price) * 100000 : 0,
            currency: data.offers?.priceCurrency || "BRL",
            images: data.image ? (Array.isArray(data.image) ? data.image : [data.image]) : [],
            url: data.url || "",
          },
        });
      } else if (data["@type"] === "ItemList" && Array.isArray(data.itemListElement)) {
        for (const elem of data.itemListElement) {
          const item = elem.item || elem;
          if (item) {
            items.push({
              item_basic: {
                itemid: item.sku || item.productID || item.name,
                name: item.name,
                price: item.offers?.price ? Number(item.offers.price) * 100000 : 0,
                currency: item.offers?.priceCurrency || "BRL",
                images: item.image ? (Array.isArray(item.image) ? item.image : [item.image]) : [],
                url: item.url || "",
              },
            });
          }
        }
      }
    } catch {
      // ignore JSON parse error in individual script blocks
    }
  }
  return items;
}

/**
 * Strategy: Extract products from window.__PRELOADED_STATE__
 */
export function extractFromPreloadedState(state: any, shopId?: string): any[] {
  if (!state || typeof state !== "object") return [];
  const items: any[] = [];

  const candidateLists = [
    state?.shopItems?.items,
    state?.itemsList?.items,
    state?.shop?.items,
    state?.searchResult?.items,
  ];

  for (const list of candidateLists) {
    if (Array.isArray(list) && list.length > 0) {
      for (const raw of list) {
        const item = raw.item_basic || raw;
        if (item && (item.itemid || item.id)) {
          items.push({ item_basic: item });
        }
      }
      if (items.length > 0) return items;
    }
  }

  return items;
}

/**
 * Strategy: Extract products from DOM Anchor Links
 */
export function extractFromDomLinks(
  links: Array<{ href: string; text?: string; imgSrc?: string }>,
  targetShopId?: string,
): any[] {
  const items: any[] = [];
  const productRegex = /i\.(\d{4,})\.(\d{4,})(?:[/?#]|$)/i;
  const productRegexAlt = /-i\.(\d{4,})\.(\d{4,})(?:[/?#]|$)/i;
  const seenItemIds = new Set<string>();

  for (const link of links) {
    const href = link.href || "";
    const match = href.match(productRegex) || href.match(productRegexAlt);
    if (match && match[1] && match[2]) {
      const sid = match[1];
      const iid = match[2];

      if (targetShopId && sid !== targetShopId) {
        continue;
      }

      if (!seenItemIds.has(iid)) {
        seenItemIds.add(iid);
        items.push({
          item_basic: {
            itemid: iid,
            shopid: sid,
            name: link.text?.trim() || `Produto ${iid}`,
            price: 0,
            currency: "BRL",
            images: link.imgSrc ? [link.imgSrc] : [],
            url: href,
          },
        });
      }
    }
  }

  return items;
}
