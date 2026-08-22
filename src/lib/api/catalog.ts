import { CatalogStats, Store, Product, SyncResponse, IngestionApiResponse } from './types';

function getApiBaseUrl(): string {
  const url = import.meta.env['VITE_CATALOG_API_URL'];
  if (url && typeof url === 'string' && url.trim().length > 0) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  return 'https://pub-ecom-catalog-worker.contato-pubcore.workers.dev';
}

function getApiToken(): string | undefined {
  const token = import.meta.env['VITE_CATALOG_API_TOKEN'];
  if (token && typeof token === 'string' && token.trim().length > 0) {
    return token.trim();
  }
  return undefined;
}

// Safe client-side diagnostic logging (NEVER logs the secret token value)
if (typeof window !== 'undefined') {
  console.log({
    catalogApiUrl: getApiBaseUrl(),
    catalogTokenConfigured: Boolean(getApiToken()),
  });
}

function normalizeStore(raw: any): Store {
  return {
    id: raw.id || `shopee:${raw.sourceStoreId || raw.shopId || 'unknown'}`,
    name: raw.name || raw.username || 'Loja Shopee',
    username: raw.username || raw.sourceStoreId || '',
    source: raw.source || 'shopee',
    shopId: raw.sourceStoreId || raw.shopId || '',
    status: raw.status || 'active',
    syncState: raw.syncState || (raw.status === 'active' ? 'success' : 'idle'),
    productCount: Number(raw.productCount) || 0,
    lastSyncAt: raw.lastSyncAt || null,
    lastSyncStatus: raw.lastSyncStatus || null,
    metadata: raw.metadata || {},
  };
}

function normalizeProduct(raw: any): Product {
  return {
    id: raw.id || `${raw.source || 'shopee'}:${raw.sourceStoreId || ''}:${raw.externalProductId || raw.externalId || ''}`,
    externalId: raw.externalProductId || raw.externalId || raw.itemId || '',
    storeId: raw.sourceStoreId || raw.storeId || raw.shopId || '',
    title: raw.title || '',
    description: raw.description || null,
    price: typeof raw.price === 'number' ? raw.price : Number(raw.price) || 0,
    currency: raw.currency || 'BRL',
    images: Array.isArray(raw.images) ? raw.images : [],
    url: raw.sourceProductUrl || raw.url || raw.productUrl || '',
    sku: raw.sku || null,
    category: raw.category || null,
    updatedAt: raw.updatedAt || new Date().toISOString(),
    metadata: raw.metadata || {},
  };
}

export class CatalogApi {
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const token = getApiToken();
    const url = `${baseUrl}${path}`;
    const headers = new Headers(options.headers);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && options.method !== 'GET' && options.method !== 'HEAD') {
      headers.set('Content-Type', 'application/json');
    }

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (err: any) {
      throw new Error(`Falha de conexão com Catalog Worker: ${err.message || String(err)}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        const error = new Error('Catalog API: autenticação não configurada ou inválida no Preview.') as any;
        error.status = 401;
        error.isAuthError = true;
        throw error;
      }

      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.message || `Erro HTTP ${response.status}`;
      const error = new Error(errorMsg) as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response.json();
  }

  async getStats(): Promise<CatalogStats> {
    const data = await this.request<any>('/v1/catalog/stats');
    return data;
  }

  async getStores(): Promise<Store[]> {
    const data = await this.request<any>('/v1/catalog/stores');
    const rawList = data.items || data.stores || [];
    return Array.isArray(rawList) ? rawList.map(normalizeStore) : [];
  }

  async getStore(id: string): Promise<Store> {
    const data = await this.request<any>(`/v1/catalog/stores/${encodeURIComponent(id)}`);
    const raw = data.item || data.store || data;
    return normalizeStore(raw);
  }

  async getStoreProducts(storeId: string): Promise<Product[]> {
    const data = await this.request<any>(`/v1/catalog/stores/${encodeURIComponent(storeId)}/products`);
    const rawList = data.items || data.products || [];
    return Array.isArray(rawList) ? rawList.map(normalizeProduct) : [];
  }

  async refreshStore(storeId: string): Promise<SyncResponse> {
    const data = await this.request<any>(`/v1/catalog/stores/${encodeURIComponent(storeId)}/refresh`, {
      method: 'POST',
    });

    const syncInfo = data.sync || {};
    return {
      success: data.success ?? true,
      syncRunId: syncInfo.syncRunId || data.syncRunId || '',
      message: data.message || 'Sincronização realizada com sucesso',
      results: {
        productsFound: syncInfo.productsFound ?? 0,
        created: syncInfo.created ?? 0,
        updated: syncInfo.updated ?? 0,
        unchanged: syncInfo.unchanged ?? 0,
        failed: syncInfo.failed ?? 0,
        provider: syncInfo.provider || 'apify',
        duration: syncInfo.durationMs ?? syncInfo.duration ?? 0,
        syncRunId: syncInfo.syncRunId,
      },
    };
  }

  async getProducts(params?: Record<string, string>): Promise<Product[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const data = await this.request<any>(`/v1/catalog/products${query}`);
    const rawList = data.items || data.products || [];
    return Array.isArray(rawList) ? rawList.map(normalizeProduct) : [];
  }

  async getProduct(id: string): Promise<Product> {
    const data = await this.request<any>(`/v1/catalog/products/${encodeURIComponent(id)}`);
    const raw = data.item || data.product || data;
    return normalizeProduct(raw);
  }

  async ingestShopee(url: string, limit = 30): Promise<IngestionApiResponse> {
    const data = await this.request<IngestionApiResponse>('/ingestion/shopee', {
      method: 'POST',
      body: JSON.stringify({ url, limit }),
    });
    return data;
  }
}

export const catalogApi = new CatalogApi();
