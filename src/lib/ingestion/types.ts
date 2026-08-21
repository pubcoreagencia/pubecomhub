
export type ImportStatus = 
  | 'pending'
  | 'discovering'
  | 'extracting'
  | 'normalizing'
  | 'preview_ready'
  | 'approved'
  | 'completed'
  | 'partial'
  | 'failed';

export interface CatalogSource {
  id: string;
  url: string;
  type: 'shopee' | 'mercado_livre' | 'tiktok_shop' | 'generic';
  supplierId?: string;
  name?: string;
}

export interface RawProduct {
  externalId: string;
  url: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  sku?: string;
  images: string[];
  category?: string;
  metadata?: Record<string, any>;
}

export interface NormalizedProduct {
  externalId: string;
  sourceUrl: string;
  title: string;
  description?: string | null;
  supplierCost: number;
  basePricePub: number;
  sku: string;
  images: string[];
  category?: string | null;
  metadata?: Record<string, any> | null;
}

export interface SupplierImport {
  id: string;
  supplierId: string;
  sourceUrl: string;
  startedAt: string;
  finishedAt?: string;
  totalFound: number;
  imported: number;
  updated: number;
  duplicated: number;
  failed: number;
  status: ImportStatus;
  errorSummary?: string;
}

export interface SupplierImportItem {
  id: string;
  importId: string;
  rawExternalId: string;
  normalizedData: NormalizedProduct;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed';
  errorMessage?: string;
}

export interface ImportPreview {
  supplierName: string;
  sourceUrl: string;
  totalFound: number;
  newItems: number;
  updates: number;
  duplicates: number;
  errors: number;
  items: NormalizedProduct[];
}

export interface CatalogSourceAdapter {
  canHandle(url: string): boolean;
  discover(url: string): Promise<RawProduct[]>;
}
