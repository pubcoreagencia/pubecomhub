export interface AnalyzeUrlResponse {
  success: boolean;
  provider: string;
  strategyUsed: string;
  durationMs: number;
  product: {
    id: string;
    externalId: string;
    source: string;
    sourceUrl: string;
    title: string;
    description: string | null;
    price: number;
    currency: string;
    images: string[];
    thumbnail: string | null;
    variants: any[];
    sku: string | null;
    stock: number | null;
    category: string | null;
    brand: string | null;
    attributes: Record<string, any>;
    metadata: Record<string, any>;
  } | null;
  preview: {
    title: string;
    mainImage: string;
    costPrice: number;
    suggestedSalePrice: number;
    projectedProfit: number;
    markupPercent: number;
    marketplace: string;
    variantsCount: number;
    imagesCount: number;
  } | null;
  provenance: Record<string, { value: any; source: string }>;
  warnings: string[];
  error?: string;
}

export interface CommitImportResponse {
  success: boolean;
  importId?: string;
  productId?: string;
  status: "IMPORTED" | "ALREADY_IMPORTED" | "INVALID" | "REJECTED_FLAG_DISABLED" | "UNAUTHORIZED" | "FAILED";
  error?: string;
}

import { supabase } from "@/integrations/supabase/client";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("[UrlImportClient] Falha ao obter sessão do Supabase:", err);
  }
  return headers;
}

export class UrlImportClient {
  /**
   * Step 1: Analyze URL
   */
  static async analyzeUrl(url: string, markupPercent = 40): Promise<AnalyzeUrlResponse> {
    try {
      const headers = await getAuthHeaders();
      console.log("[UrlImportClient] Disparando POST /api/catalog/import/analyze...");
      const res = await fetch("/api/catalog/import/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ url, markupPercent }),
      });

      console.log(`[UrlImportClient] Resposta recebida: HTTP ${res.status}`);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Erro ${res.status} ao analisar URL.`);
      }

      return await res.json();
    } catch (err: any) {
      console.error("[UrlImportClient] Erro na análise:", err.message);
      return {
        success: false,
        provider: "unknown",
        strategyUsed: "failed",
        durationMs: 0,
        product: null,
        preview: null,
        provenance: {},
        warnings: [],
        error: err.message || String(err),
      };
    }
  }

  /**
   * Step 2: Commit Import
   */
  static async commitImport(product: any, tenantId: string): Promise<CommitImportResponse> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/catalog/import/commit", {
        method: "POST",
        headers,
        body: JSON.stringify({ product, tenantId }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Erro ${res.status} ao persistir produto.`);
      }

      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        status: "FAILED",
        error: err.message || String(err),
      };
    }
  }
}

