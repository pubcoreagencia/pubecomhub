import { 
  ImportPreview, 
  NormalizedProduct, 
  RawProduct, 
  ImportStatus 
} from "./types";
import { SourceResolver } from "./SourceResolver";
import { PricingService } from "../services/PricingService";
import { masterProductRepository } from "../repositories/masterProductRepository";

export class CatalogIngestionService {
  private resolver = new SourceResolver();

  async analyzeSource(url: string): Promise<ImportPreview> {
    const adapter = this.resolver.resolve(url);
    
    if (!adapter) {
      throw new Error("Nenhum adapter encontrado para esta URL.");
    }

    const rawProducts = await adapter.discover(url);
    
    // Mapear para produtos normalizados e calcular preços base
    const items: NormalizedProduct[] = rawProducts.map(raw => ({
      externalId: raw.externalId,
      sourceUrl: raw.url,
      title: raw.title,
      description: raw.description ?? null,
      supplierCost: raw.price,
      basePricePub: PricingService.calculatePubBasePrice(raw.price),
      sku: raw.sku || `SKU-${raw.externalId}`,
      images: raw.images,
      category: raw.category ?? null,
      metadata: raw.metadata ?? null
    }));

    // Simular identificação de novos vs duplicados
    return {
      supplierName: "Fornecedor Detectado",
      sourceUrl: url,
      totalFound: items.length,
      newItems: items.length,
      updates: 0,
      duplicates: 0,
      errors: 0,
      items
    };
  }

  async confirmImport(items: NormalizedProduct[], supplierId: string): Promise<void> {
    console.log(`Importing ${items.length} products for supplier ${supplierId}`);
    
    for (const item of items) {
      await masterProductRepository.upsert({
        supplierId,
        sku: item.sku,
        name: item.title,
        description: item.description,
        imageUrl: item.images[0] ?? null,
        category: item.category,
        supplierCost: item.supplierCost,
        basePricePub: item.basePricePub,
        status: 'active',
        isAvailable: true,
        metadata: item.metadata ?? null
      });
    }
  }
}

export const catalogIngestionService = new CatalogIngestionService();
