import { MasterProduct } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export interface IMasterProductRepository {
  getAll(): Promise<MasterProduct[]>;
  getById(id: string): Promise<MasterProduct | null>;
  getBySupplier(supplierId: string): Promise<MasterProduct[]>;
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

  private mapDbToType(db: any): MasterProduct {
    return {
      id: db.id,
      supplierId: db.supplier_id,
      sku: db.sku,
      name: db.name,
      description: db.description ?? undefined,
      imageUrl: db.image_url ?? undefined,
      category: db.category ?? undefined,
      supplierCost: Number(db.supplier_cost),
      basePricePub: Number(db.base_price_pub),
      status: db.status as 'active' | 'inactive',
      isAvailable: db.is_available,
      metadata: db.metadata ?? undefined,
      created_at: db.created_at,
    };
  }
}

export const masterProductRepository = new MasterProductRepository();