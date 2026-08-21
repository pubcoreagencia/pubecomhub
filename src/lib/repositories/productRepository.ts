import { Product, IProductRepository } from '@/types';
import { mockProducts } from '@/data/mock';
import { supabase } from '@/integrations/supabase/client';

export class ProductRepository implements IProductRepository {
  private useMock = true;

  async getAll(): Promise<Product[]> {
    if (this.useMock) {
      return [...mockProducts];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    return (data || []).map(this.mapDbProductToType);
  }

  async getByStore(storeId: string): Promise<Product[]> {
    if (this.useMock) {
      return mockProducts.filter(p => p.storeId === storeId);
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId);

    if (error) throw error;
    return (data || []).map(this.mapDbProductToType);
  }

  async getById(id: string): Promise<Product | null> {
    if (this.useMock) {
      return mockProducts.find(p => p.id === id) || null;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapDbProductToType(data);
  }

  private mapDbProductToType(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      price: Number(dbProduct.price),
      cost: Number(dbProduct.cost),
      supplierId: dbProduct.supplier_id,
      storeId: dbProduct.store_id,
      stock: dbProduct.stock,
      image: dbProduct.image_url ?? undefined,
      masterProductId: dbProduct.master_product_id ?? undefined,
      customName: dbProduct.custom_name ?? undefined,
      customDescription: dbProduct.custom_description ?? undefined,
      customImageUrl: dbProduct.custom_image_url ?? undefined,
      profitMargin: dbProduct.profit_margin ? Number(dbProduct.profit_margin) : undefined,
      status: dbProduct.status as 'active' | 'inactive' | undefined,
      created_at: dbProduct.created_at,
    };
  }
}

export const productRepository = new ProductRepository();
