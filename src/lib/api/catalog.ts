import { CatalogStats, Store, Product, SyncResponse, IngestionApiResponse } from './types';
import { supabase } from '@/integrations/supabase/client';

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '';
  }
  const overrideUrl = import.meta.env['VITE_CATALOG_API_URL'];
  if (overrideUrl && typeof overrideUrl === 'string' && overrideUrl.trim().length > 0) {
    return overrideUrl.endsWith('/') ? overrideUrl.slice(0, -1) : overrideUrl;
  }
  return '';
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
    const url = `${baseUrl}${path}`;
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type') && options.method !== 'GET' && options.method !== 'HEAD') {
      headers.set('Content-Type', 'application/json');
    }

    // Automatically obtain and inject the authenticated Supabase session access token
    if (!headers.has('Authorization') && !headers.has('authorization')) {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;

        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        } else if (typeof window !== 'undefined') {
          // If in browser and not authenticated, fail early with a clear message
          const error = new Error('Usuário não autenticado. Faça login no Supabase para acessar o catálogo.') as any;
          error.status = 401;
          error.isAuthError = true;
          throw error;
        }
      } catch (authErr: any) {
        if (authErr?.isAuthError) {
          throw authErr;
        }
        console.warn('[CatalogApi] Não foi possível carregar a sessão Supabase:', authErr);
      }
    }

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (err: any) {
      throw new Error(`Falha de conexão com a API do Catálogo: ${err.message || String(err)}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 || errorData.isAuthError) {
        const error = new Error(
          errorData.error || 'Catalog API: autenticação não configurada ou sessão expirada no Preview.'
        ) as any;
        error.status = 401;
        error.isAuthError = true;
        error.data = errorData;
        throw error;
      }

      if (response.status === 403) {
        const error = new Error(
          errorData.error || 'Acesso negado: você não tem permissão para realizar esta operação.'
        ) as any;
        error.status = 403;
        error.data = errorData;
        throw error;
      }

      const errorMsg = errorData.error || errorData.message || `Erro HTTP ${response.status}`;
      const error = new Error(errorMsg) as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response.json();
  }

  async getStats(): Promise<CatalogStats> {
    const data = await this.request<any>('/api/catalog/stats');
    return data;
  }

  async getStores(): Promise<Store[]> {
    const data = await this.request<any>('/api/catalog/stores');
    const rawList = data.items || data.stores || [];
    return Array.isArray(rawList) ? rawList.map(normalizeStore) : [];
  }

  async getStore(id: string): Promise<Store> {
    const data = await this.request<any>(`/api/catalog/stores/${encodeURIComponent(id)}`);
    const raw = data.item || data.store || data;
    return normalizeStore(raw);
  }

  async getStoreProducts(storeId: string): Promise<Product[]> {
    const data = await this.request<any>(`/api/catalog/stores/${encodeURIComponent(storeId)}/products`);
    const rawList = data.items || data.products || [];
    return Array.isArray(rawList) ? rawList.map(normalizeProduct) : [];
  }

  async refreshStore(storeId: string): Promise<SyncResponse> {
    const data = await this.request<any>(`/api/catalog/stores/${encodeURIComponent(storeId)}/refresh`, {
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
    const data = await this.request<any>(`/api/catalog/products${query}`);
    const rawList = data.items || data.products || [];
    return Array.isArray(rawList) ? rawList.map(normalizeProduct) : [];
  }

  async getProduct(id: string): Promise<Product> {
    const data = await this.request<any>(`/api/catalog/products/${encodeURIComponent(id)}`);
    const raw = data.item || data.product || data;
    return normalizeProduct(raw);
  }

  async ingestShopee(url: string, limit = 30): Promise<IngestionApiResponse> {
    const data = await this.request<IngestionApiResponse>('/api/ingestion/shopee', {
      method: 'POST',
      body: JSON.stringify({ url, limit }),
    });
    return data;
  }
}

export const catalogApi = new CatalogApi();
