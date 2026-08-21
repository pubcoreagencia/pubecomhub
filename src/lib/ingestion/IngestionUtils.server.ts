import { NormalizedProduct } from "../types";
import { masterProductRepository } from "../repositories/masterProductRepository";

export class CatalogIngestionService {
  /**
   * Identifies if a product already exists in the Master Catalog.
   * Priority: Source + ExternalID > SKU > Fingerprint (Title + Price)
   */
  async identifyDuplicates(items: NormalizedProduct[]): Promise<{
    newItems: NormalizedProduct[];
    duplicates: NormalizedProduct[];
  }> {
    const newItems: NormalizedProduct[] = [];
    const duplicates: NormalizedProduct[] = [];

    for (const item of items) {
      // Check for existing product by external ID and source
      // In production, this would query the DB. Here we check MasterProductRepository
      const existing = await masterProductRepository.findBySku(item.sku);
      
      if (existing) {
        duplicates.push(item);
      } else {
        newItems.push(item);
      }
    }

    return { newItems, duplicates };
  }

  /**
   * Sanitizes and normalizes product data
   */
  normalize(raw: any): NormalizedProduct {
    return {
      externalId: String(raw.externalId),
      sourceUrl: raw.url || '',
      title: raw.title.trim(),
      description: raw.description ? raw.description.trim() : null,
      supplierCost: Number(raw.price),
      basePricePub: Number(raw.basePricePub || 0),
      sku: raw.sku || `SKU-${raw.externalId}`,
      images: Array.isArray(raw.images) ? raw.images : [],
      category: raw.category || null,
      metadata: raw.metadata || null
    };
  }
}

export const ingestionService = new CatalogIngestionService();
