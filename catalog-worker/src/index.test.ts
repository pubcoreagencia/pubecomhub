import { describe, it, expect, vi } from "vitest";

// Mock chromium from @cloudflare/playwright
vi.mock("@cloudflare/playwright", () => ({
  chromium: {
    launch: vi.fn(),
    sessions: vi.fn(),
    history: vi.fn(),
    limits: vi.fn(),
  },
}));

import worker from "./index";

const env = {
  BROWSER: {},
  CATALOG_WORKER_TOKEN: "test-token",
};

describe("Catalog Worker CORS", () => {
  it("should handle preflight OPTIONS request", async () => {
    const req = new Request("http://localhost/ingestion/shopee", {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:8080",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Authorization, Content-Type",
      },
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.status).toBe(204);
    expect(resp.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:8080");
    expect(resp.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("should add CORS to unauthorized responses", async () => {
    const req = new Request("http://localhost/ingestion/shopee", {
      method: "POST",
      headers: {
        Origin: "http://localhost:8080",
        Authorization: "Bearer wrong-token",
      },
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.status).toBe(401);
    expect(resp.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:8080");
  });

  it("should not allow unauthorized origins", async () => {
    const req = new Request("http://localhost/health", {
      method: "GET",
      headers: {
        Origin: "https://malicious.com",
      },
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("should allow Cloudflare Pages and Workers preview origins", async () => {
    const req = new Request("http://localhost/health", {
      method: "GET",
      headers: {
        Origin: "https://pubcoreagencia-pubecomhub.pages.dev",
      },
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://pubcoreagencia-pubecomhub.pages.dev",
    );
  });

  it("should return catalog products from D1 when authorized", async () => {
    const mockDb = {
      exec: vi.fn().mockResolvedValue({}),
      prepare: vi.fn().mockReturnValue({
        bind: vi.fn().mockReturnValue({
          all: vi.fn().mockResolvedValue({
            results: [
              {
                id: "shopee:1729928484:1001",
                external_id: "1001",
                store_id: "shopee:1729928484",
                title: "Sandalia Babuche Infantil",
                price: 29.9,
                currency: "BRL",
                images: JSON.stringify(["https://cf.shopee.com.br/file/img1.jpg"]),
                url: "https://shopee.com.br/product/1729928484/1001",
                sku: "SKU-1001",
                category: "Calçados",
                updated_at: "2026-08-24T12:00:00Z",
              },
            ],
          }),
          first: vi.fn().mockResolvedValue({ total: 1 }),
        }),
      }),
    };

    const req = new Request("http://localhost/v1/catalog/products?limit=10", {
      method: "GET",
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    const resp = await worker.fetch(req, { ...env, DB: mockDb } as any);
    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(json.success).toBe(true);
    expect(json.items).toHaveLength(1);
    expect(json.items[0].title).toBe("Sandalia Babuche Infantil");
    expect(json.items[0].images).toEqual(["https://cf.shopee.com.br/file/img1.jpg"]);
  });
});

