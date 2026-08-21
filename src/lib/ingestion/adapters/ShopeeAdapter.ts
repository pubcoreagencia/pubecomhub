import { CatalogSourceAdapter, RawProduct } from "../types";
import { PricingService } from "../../services/PricingService";

export class ShopeeAdapter implements CatalogSourceAdapter {
  canHandle(url: string): boolean {
    return url.includes('shopee.com.br');
  }

  async discover(url: string): Promise<RawProduct[]> {
    // A implementação real dependeria de API ou Scraper isolado
    // Por enquanto, seguimos a diretriz de não contornar proteções
    // e preparamos a estrutura para o Mock Fallback
    console.log(`ShopeeAdapter: Analyzing ${url}`);
    return [];
  }
}
