import { describe, it, expect } from "vitest";
import {
  detectShopeeChallenge,
  extractFromJsonLd,
  extractFromPreloadedState,
  extractFromDomLinks,
} from "../catalog-worker/src/ingestionEngine";

describe("Shopee Ingestion Engine V2 — Unit Tests", () => {
  // Test 1: Catálogo com produtos válidos
  it("1. Catálogo com produtos -> extrai itens com sucesso", () => {
    const mockLinks = [
      {
        href: "https://shopee.com.br/Sandalia-Babuche-Infantil-i.1729928484.1001",
        text: "Sandalia Babuche Infantil",
        imgSrc: "https://cf.shopee.com.br/file/img1.jpg",
      },
      {
        href: "https://shopee.com.br/Babuche-Adulto-Confortavel-i.1729928484.1002",
        text: "Babuche Adulto Confortavel",
        imgSrc: "https://cf.shopee.com.br/file/img2.jpg",
      },
    ];

    const items = extractFromDomLinks(mockLinks, "1729928484");
    expect(items.length).toBe(2);
    expect(items[0].item_basic.itemid).toBe("1001");
    expect(items[0].item_basic.name).toBe("Sandalia Babuche Infantil");
    expect(items[1].item_basic.itemid).toBe("1002");
  });

  // Test 2: Catálogo realmente vazio (sem sinais de proteção)
  it("2. Catálogo realmente vazio -> detectShopeeChallenge retorna false", () => {
    const normalUrl = "https://shopee.com.br/loja-vazia";
    const normalTitle = "Loja Vazia Oficial | Shopee Brasil";
    const normalHtml =
      "<html><body><div class='shop-empty'>Nenhum produto cadastrado no momento.</div></body></html>";

    const challenge = detectShopeeChallenge(normalUrl, normalHtml, normalTitle);
    expect(challenge.isChallenge).toBe(false);
  });

  // Test 3: Página /verify/traffic/error
  it("3. Página /verify/traffic/error -> detectShopeeChallenge detecta anti-bot", () => {
    const verifyUrl =
      "https://shopee.com.br/verify/traffic/error?home_url=https%3A%2F%2Fshopee.com.br";
    const verifyTitle = "Zentta Babuche, Loja Online | Shopee Brasil";
    const verifyHtml =
      "<html><body><h1>Página indisponível</h1><div class='traffic-error'>Traffic Error</div></body></html>";

    const challenge = detectShopeeChallenge(verifyUrl, verifyHtml, verifyTitle);
    expect(challenge.isChallenge).toBe(true);
    expect(challenge.reason).toContain("/verify/");
  });

  // Test 4: Captcha / Challenge detectado por título ou assinatura
  it("4. Captcha/Challenge detectado por título e corpo HTML", () => {
    const challenge1 = detectShopeeChallenge(
      "https://shopee.com.br/shop/123",
      "",
      "Security Verification",
    );
    expect(challenge1.isChallenge).toBe(true);

    const challenge2 = detectShopeeChallenge(
      "https://shopee.com.br/shop/123",
      "<div id='challenge-form'></div>",
      "",
    );
    expect(challenge2.isChallenge).toBe(true);

    const challenge3 = detectShopeeChallenge("https://shopee.com.br/api", "", "", 200, {
      error: 90309999,
    });
    expect(challenge3.isChallenge).toBe(true);
    expect(challenge3.reason).toContain("90309999");
  });

  // Test 5: JSON-LD com produtos
  it("5. JSON-LD com produtos -> extrai dados estruturados", () => {
    const jsonLdScripts = [
      JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        name: "Babuche Antiderrapante",
        sku: "BAB-001",
        image: "https://cf.shopee.com.br/file/bab001.jpg",
        offers: {
          "@type": "Offer",
          price: "39.90",
          priceCurrency: "BRL",
        },
      }),
      JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "ItemList",
        itemListElement: [
          {
            "@type": "Product",
            name: "Babuche Infantil Rosa",
            sku: "BAB-002",
            image: "https://cf.shopee.com.br/file/bab002.jpg",
            offers: { price: "29.90", priceCurrency: "BRL" },
          },
        ],
      }),
    ];

    const items = extractFromJsonLd(jsonLdScripts);
    expect(items.length).toBe(2);
    expect(items[0].item_basic.name).toBe("Babuche Antiderrapante");
    expect(items[0].item_basic.price).toBe(3990000);
    expect(items[1].item_basic.name).toBe("Babuche Infantil Rosa");
  });

  // Test 6: Preloaded state com produtos
  it("6. Preloaded state com produtos -> extrai itens do estado do cliente", () => {
    const mockPreloadedState = {
      shopItems: {
        items: [
          {
            itemid: "998877",
            name: "Babuche Premium Confort",
            price: 4990000,
            currency: "BRL",
          },
        ],
      },
    };

    const items = extractFromPreloadedState(mockPreloadedState);
    expect(items.length).toBe(1);
    expect(items[0].item_basic.itemid).toBe("998877");
    expect(items[0].item_basic.name).toBe("Babuche Premium Confort");
  });

  // Test 7: Primeira estratégia falha (vazia) e segunda funciona
  it("7. Fallback de estratégia: Preloaded vazio -> DOM Links funciona", () => {
    const emptyState = {};
    const stateItems = extractFromPreloadedState(emptyState);
    expect(stateItems.length).toBe(0);

    const domLinks = [
      {
        href: "https://shopee.com.br/Babuche-i.1729928484.5555",
        text: "Babuche Estampado",
      },
    ];
    const domItems = extractFromDomLinks(domLinks, "1729928484");
    expect(domItems.length).toBe(1);
    expect(domItems[0].item_basic.itemid).toBe("5555");
  });

  // Test 8: Todas as estratégias falham em conteúdo vazio
  it("8. Todas as estratégias falham em conteúdo vazio -> 0 itens", () => {
    const itemsJsonLd = extractFromJsonLd([]);
    const itemsPreloaded = extractFromPreloadedState(null);
    const itemsDom = extractFromDomLinks([]);

    expect(itemsJsonLd.length).toBe(0);
    expect(itemsPreloaded.length).toBe(0);
    expect(itemsDom.length).toBe(0);
  });

  // Test 9: Deduplicação de IDs dentro da mesma extração
  it("9. Deduplica produtos repetidos no mesmo DOM", () => {
    const duplicateLinks = [
      { href: "https://shopee.com.br/Babuche-i.1729928484.7777", text: "Link 1" },
      { href: "https://shopee.com.br/Babuche-i.1729928484.7777", text: "Link 2" },
      { href: "https://shopee.com.br/Babuche-i.1729928484.8888", text: "Link 3" },
    ];

    const items = extractFromDomLinks(duplicateLinks, "1729928484");
    expect(items.length).toBe(2);
    expect(items.map((i) => i.item_basic.itemid)).toEqual(["7777", "8888"]);
  });

  // Test 10: Isolamento por ShopID
  it("10. Ignora links de outras lojas presentes no rodapé/anúncios", () => {
    const mixedLinks = [
      { href: "https://shopee.com.br/Outra-Loja-i.999999.1111", text: "Outro Shop" },
      { href: "https://shopee.com.br/Minha-Loja-i.1729928484.2222", text: "Meu Produto" },
    ];

    const items = extractFromDomLinks(mixedLinks, "1729928484");
    expect(items.length).toBe(1);
    expect(items[0].item_basic.itemid).toBe("2222");
    expect(items[0].item_basic.shopid).toBe("1729928484");
  });
});
