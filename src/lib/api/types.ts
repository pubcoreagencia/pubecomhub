
export interface CatalogStats {
  success: boolean;
  stats: {
    products: number;
    stores: number;
    activeStores: number;
    errorStores: number;
    sources: Record<string, { products: number; stores: number }>;
    sync: {
      idle: number;
      running: number;
      success: number;
      partial: number;
      error: number;
    };
  };
}

export interface Store {
  id: string; // canonicalId: e.g. "shopee:1729928484"
  name: string;
  username: string;
  source: 'shopee' | string;
  shopId: string;
  status: 'active' | 'inactive' | 'error';
  syncState: 'idle' | 'running' | 'success' | 'partial' | 'failed';
  productCount: number;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  externalId: string;
  storeId: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  images: string[];
  url: string;
  sku: string | null;
  category: string | null;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface SyncResponse {
  success: boolean;
  syncRunId: string;
  message: string;
  results?: {
    productsFound: number;
    created: number;
    updated: number;
    unchanged: number;
    failed: number;
    provider: string;
    duration: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  syncRunId?: string;
}
