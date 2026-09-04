/**
 * Shopee Catalog Provider
 *
 * Encapsulates all Shopee-specific crawling, ShopID discovery,
 * DOM / SSR extraction strategies, anti-bot challenge detection,
 * price/image normalization, and strategy diagnostics.
 */

import {
  CatalogProvider,
  ExtractionStatus,
  NormalizedProduct,
  ProviderExtractionResult,
  StoreTarget,
  StrategyDiagnostic,
} from "./CatalogProvider";

async function getBrowserLauncher() {
  const pkgName = "@cloudflare/puppeteer";
  // @ts-ignore
  const mod = await import(pkgName);
  return mod.launch || (mod as any).default?.launch;
}

export interface ChallengeDetectionResult {
  isChallenge: boolean;
  reason: string;
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

export class ShopeeProvider implements CatalogProvider {
  readonly name = "ShopeeProvider";
  readonly source = "shopee";

  canHandle(source: string): boolean {
    return source.toLowerCase() === "shopee";
  }

  async extract(target: StoreTarget, limit: number, env: any): Promise<ProviderExtractionResult> {
    const launchBrowser = await getBrowserLauncher();
    const browser = await launchBrowser(env.BROWSER);
    const startTime = Date.now();
    let attempts = 0;
    let challengeDetected = false;
    let challengeReason = "";
    let items: any[] = [];
    let strategyUsed = "none";
    let resolvedShopId: string | null = target.shopId || null;
    let username = target.username || "";
    let finalUrl = "";
    const strategiesDiagnostics: StrategyDiagnostic[] = [];

    // Derive target URL
    let targetUrl = "";
    if (target.metadata && target.metadata.url) {
      targetUrl = target.metadata.url;
    } else if (username) {
      targetUrl = `https://shopee.com.br/${username}`;
    } else if (resolvedShopId) {
      targetUrl = `https://shopee.com.br/shop/${resolvedShopId}`;
    } else {
      targetUrl = `https://shopee.com.br/${target.id.replace("shopee:", "")}`;
    }

    try {
      const cleanUrl = targetUrl.split("#")[0].split("?")[0];
      const urlParts = cleanUrl.split("/").filter(Boolean);
      const parsedUsername = urlParts[urlParts.length - 1] || "";
      if (!username && parsedUsername) username = parsedUsername;

      if (!resolvedShopId && username.toLowerCase() === "zenttababuche") {
        resolvedShopId = "1729928484";
      }

      const navigationTargets = [targetUrl];
      if (resolvedShopId) {
        navigationTargets.push(`https://shopee.com.br/shop/${resolvedShopId}/search`);
      }

      for (const navUrl of navigationTargets) {
        if (items.length > 0) break;
        attempts++;
        const navStart = Date.now();

        const context = await browser.newContext({
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          viewport: { width: 1280, height: 800 },
          locale: "pt-BR",
        });
        const page = await context.newPage();

        try {
          const navResp = await page
            .goto(navUrl, { waitUntil: "domcontentloaded", timeout: 30000 })
            .catch(() => null);
          await page.waitForTimeout(2000);
          finalUrl = page.url();
          const httpStatus = navResp?.status() || 200;

          // 1. Detect anti-bot / challenge on page
          const pageMeta = await page.evaluate(() => {
            return {
              title: document.title || "",
              htmlSnippet: document.documentElement
                ? document.documentElement.innerHTML.substring(0, 5000)
                : "",
              preloadedState: (globalThis as any).__PRELOADED_STATE__ || null,
              scriptsJsonLd: Array.from(
                document.querySelectorAll('script[type="application/ld+json"]'),
              ).map((s) => s.textContent || ""),
              links: Array.from(document.querySelectorAll("a[href]")).map((a) => ({
                href: (a as HTMLAnchorElement).href,
                text: a.textContent || "",
                imgSrc:
                  a.querySelector("img")?.src ||
                  a.querySelector("img")?.getAttribute("data-src") ||
                  "",
              })),
            };
          });

          const challengeCheck = detectShopeeChallenge(
            finalUrl,
            pageMeta.htmlSnippet,
            pageMeta.title,
            httpStatus,
          );
          if (challengeCheck.isChallenge) {
            challengeDetected = true;
            challengeReason = challengeCheck.reason;
          }

          // Diagnostic entry for Public Page / SSR
          strategiesDiagnostics.push({
            strategy: navUrl === targetUrl ? "public_page_ssr" : "shop_category_tab",
            url: finalUrl,
            httpStatus,
            durationMs: Date.now() - navStart,
            productsFound: 0,
            challengeDetected: challengeCheck.isChallenge,
            reason: challengeCheck.isChallenge ? challengeCheck.reason : "Carregamento concluído",
          });

          // Strategy 1: Preloaded State
          if (items.length === 0 && pageMeta.preloadedState) {
            const preloadedItems = extractFromPreloadedState(
              pageMeta.preloadedState,
              resolvedShopId || undefined,
            );
            if (preloadedItems.length > 0) {
              items = preloadedItems.slice(0, limit);
              strategyUsed = "preloaded_state";
              strategiesDiagnostics.push({
                strategy: "preloaded_state",
                url: finalUrl,
                httpStatus: 200,
                durationMs: Date.now() - navStart,
                productsFound: items.length,
                challengeDetected: false,
                reason: "Itens extraídos do preloaded state",
              });
              break;
            }
          }

          // Strategy 2: JSON-LD
          if (items.length === 0 && pageMeta.scriptsJsonLd.length > 0) {
            const jsonLdItems = extractFromJsonLd(pageMeta.scriptsJsonLd);
            if (jsonLdItems.length > 0) {
              items = jsonLdItems.slice(0, limit);
              strategyUsed = "json_ld";
              strategiesDiagnostics.push({
                strategy: "json_ld",
                url: finalUrl,
                httpStatus: 200,
                durationMs: Date.now() - navStart,
                productsFound: items.length,
                challengeDetected: false,
                reason: "Itens extraídos do JSON-LD",
              });
              break;
            }
          }

          // Strategy 3: DOM Links & Product Cards with smooth scroll
          if (items.length === 0) {
            await page
              .evaluate(async () => {
                window.scrollBy(0, 600);
                await new Promise((r) => setTimeout(r, 400));
                window.scrollBy(0, 800);
              })
              .catch(() => {});

            const scrolledLinks = await page
              .evaluate(() => {
                return Array.from(document.querySelectorAll("a[href]")).map((a) => ({
                  href: (a as HTMLAnchorElement).href,
                  text: a.textContent || "",
                  imgSrc:
                    a.querySelector("img")?.src ||
                    a.querySelector("img")?.getAttribute("data-src") ||
                    "",
                }));
              })
              .catch(() => pageMeta.links);

            const domItems = extractFromDomLinks(scrolledLinks, resolvedShopId || undefined);
            if (domItems.length > 0) {
              items = domItems.slice(0, limit);
              strategyUsed = "dom_cards";
              strategiesDiagnostics.push({
                strategy: "dom_cards",
                url: finalUrl,
                httpStatus: 200,
                durationMs: Date.now() - navStart,
                productsFound: items.length,
                challengeDetected: false,
                reason: "Itens extraídos dos links/cards no DOM",
              });
              break;
            }
          }

          // Strategy 4: Internal API evaluation from browser context
          if (items.length === 0 && !challengeCheck.isChallenge && resolvedShopId) {
            const apiStart = Date.now();
            const apiResult = await page
              .evaluate(
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
                    return { status: resp.status, json, items: json.items || [] };
                  } catch {
                    return { status: 0, json: null, items: [] };
                  }
                },
                { sid: resolvedShopId, lmt: limit },
              )
              .catch(() => ({ status: 0, json: null, items: [] }));

            const apiChallenge = detectShopeeChallenge(
              "",
              "",
              "",
              apiResult.status,
              apiResult.json,
            );
            strategiesDiagnostics.push({
              strategy: "contextual_page_data",
              url: "https://shopee.com.br/api/v4/search/search_items",
              httpStatus: apiResult.status,
              durationMs: Date.now() - apiStart,
              productsFound: Array.isArray(apiResult.items) ? apiResult.items.length : 0,
              challengeDetected: apiChallenge.isChallenge,
              reason: apiChallenge.isChallenge
                ? apiChallenge.reason
                : apiResult.items.length > 0
                  ? "Itens obtidos via API contextual"
                  : "Nenhum item retornado",
            });

            if (apiChallenge.isChallenge) {
              challengeDetected = true;
              challengeReason = apiChallenge.reason;
            } else if (Array.isArray(apiResult.items) && apiResult.items.length > 0) {
              items = apiResult.items.slice(0, limit);
              strategyUsed = "contextual_page_data";
              break;
            }
          }
        } finally {
          await context.close();
        }
      }
    } finally {
      await browser.close();
    }

    const durationMs = Date.now() - startTime;
    let status: ExtractionStatus = "success";
    let reason: ExtractionStatus = "success";

    if (items.length > 0) {
      status = "success";
      reason = "success";
    } else if (challengeDetected) {
      status = "anti_bot";
      reason = "anti_bot";
    } else {
      status = "empty_catalog";
      reason = "empty_catalog";
    }

    const normalizedProducts: NormalizedProduct[] = items.map((raw) =>
      normalizeShopeeProduct(raw, target.id, resolvedShopId || username),
    );

    return {
      success: status === "success" || status === "empty_catalog",
      status,
      provider: "shopee",
      shopId: resolvedShopId,
      username,
      products: normalizedProducts,
      strategyUsed:
        items.length > 0 ? strategyUsed : challengeDetected ? "anti_bot" : "empty_catalog",
      attempts,
      challengeDetected,
      reason,
      error: challengeDetected
        ? `Sincronização bloqueada pela proteção da fonte (${challengeReason})`
        : undefined,
      diagnostics: strategiesDiagnostics,
      metadata: {
        provider: "cloudflare-browser-run",
        source: "shopee",
        shopId: resolvedShopId,
        strategy: strategyUsed,
        attempts,
        challengeDetected,
        reason,
        discovered: items.length,
        persisted: 0,
        executionTimeMs: durationMs,
        finalPageUrl: finalUrl,
        details: challengeReason || undefined,
        strategies: strategiesDiagnostics,
      },
    };
  }
}
