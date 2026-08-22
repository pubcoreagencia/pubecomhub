
import { CatalogStats, Store, Product, SyncResponse } from './types';

const API_BASE_URL = import.meta.env['VITE_CATALOG_API_URL'] || 'https://pub-ecom-catalog-worker.contato-pubcore.workers.dev';
const API_TOKEN = import.meta.env['VITE_CATALOG_API_TOKEN'];

class CatalogApi {
  private baseUrl: string;
  private token: string | undefined;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(options.headers);
    
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`) as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response.json();
  }

  async getStats(): Promise<CatalogStats> {
    return this.request<CatalogStats>('/v1/catalog/stats');
  }

  async getStores(): Promise<Store[]> {
    const data = await this.request<{ stores: Store[] }>('/v1/catalog/stores');
    return data.stores;
  }

  async getStore(id: string): Promise<Store> {
    const data = await this.request<{ store: Store }>(`/v1/catalog/stores/${id}`);
    return data.store;
  }

  async getStoreProducts(storeId: string): Promise<Product[]> {
    const data = await this.request<{ products: Product[] }>(`/v1/catalog/stores/${storeId}/products`);
    return data.products;
  }

  async refreshStore(storeId: string): Promise<SyncResponse> {
    return this.request<SyncResponse>(`/v1/catalog/stores/${storeId}/refresh`, {
      method: 'POST',
    });
  }

  async getProducts(params?: Record<string, string>): Promise<Product[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const data = await this.request<{ products: Product[] }>(`/v1/catalog/products${query}`);
    return data.products;
  }

  async getProduct(id: string): Promise<Product> {
    const data = await this.request<{ product: Product }>(`/v1/catalog/products/${id}`);
    return data.product;
  }
}

export const catalogApi = new CatalogApi(API_BASE_URL, API_TOKEN);
