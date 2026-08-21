import { MasterProduct } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export interface IMasterProductRepository {
  getAll(): Promise<MasterProduct[]>;
  getById(id: string): Promise<MasterProduct | null>;
  getBySupplier(supplierId: string): Promise<MasterProduct[]>;
  upsert(product: Omit<MasterProduct, 'id' | 'created_at'>): Promise<MasterProduct>;
}

export class MasterProductRepository implements IMasterProductRepository {
  private useMock = true;

  async getAll(): Promise<MasterProduct[]> {
    if (this.useMock) {
      return []; // To be filled with mocks if needed
    }

    const { data, error } = await supabase
      .from('master_products')
      .select('*');

    if (error) throw error;
    return (data || []).map(this.mapDbToType);
  }

  async getById(id: string): Promise<MasterProduct | null> {
    if (this.useMock) return null;

    const { data, error } = await supabase
      .from('master_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapDbToType(data);
  }

  async getBySupplier(supplierId: string): Promise<MasterProduct[]> {
    if (this.useMock) return [];

    const { data, error } = await supabase
      .from('master_products')
      .select('*')
      .eq('supplier_id', supplierId);

    if (error) throw error;
    return (data || []).map(this.mapDbToType);
  }

  async upsert(product: Omit<MasterProduct, 'id' | 'created_at'>): Promise<MasterProduct> {
    if (this.useMock) {
      console.log('Mock upsert:', product);
      return { ...product, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() } as MasterProduct;
    }

    const { data, error } = await supabase
      .from('master_products')
      .upsert({
        supplier_id: product.supplierId,
        sku: product.sku,
        name: product.name,
        description: product.description ?? null,
        image_url: product.imageUrl ?? null,
        category: product.category ?? null,
        supplier_cost: product.supplierCost,
        base_price_pub: product.basePricePub,
        status: product.status,
        is_available: product.isAvailable,
        metadata: (product.metadata as any) ?? null
      }, { onConflict: 'sku' }) // Supondo SKU único
      .select()
      .single();

    if (error) throw error;
    return this.mapDbToType(data);
  }

  private mapDbToType(db: any): MasterProduct {
    return {
      id: db.id,
      supplierId: db.supplier_id,
      sku: db.sku,
      name: db.name,
      description: db.description ?? null,
      imageUrl: db.image_url ?? null,
      category: db.category ?? null,
      supplierCost: Number(db.supplier_cost),
      basePricePub: Number(db.base_price_pub),
      status: db.status as 'active' | 'inactive',
      isAvailable: db.is_available,
      metadata: db.metadata ?? null,
      created_at: db.created_at,
    };
  }
}

export const masterProductRepository = new MasterProductRepository();
