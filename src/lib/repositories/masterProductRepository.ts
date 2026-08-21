import { supabase } from "@/integrations/supabase/client";
import { MasterProduct } from "@/types";

export class MasterProductRepository {
  async findAll(): Promise<MasterProduct[]> {
    const { data, error } = await supabase
      .from('master_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async findBySku(sku: string): Promise<MasterProduct | null> {
    const { data, error } = await supabase
      .from('master_products')
      .select('*')
      .eq('sku', sku)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapToEntity(data) : null;
  }

  async findByExternalId(externalId: string, supplierId: string): Promise<MasterProduct | null> {
    const { data, error } = await supabase
      .from('master_products')
      .select('*')
      .eq('metadata->>external_id', externalId)
      .eq('supplier_id', supplierId)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapToEntity(data) : null;
  }

  async upsert(product: Partial<MasterProduct>): Promise<MasterProduct> {
    const { data, error } = await supabase
      .from('master_products')
      .upsert({
        supplier_id: product.supplierId,
        sku: product.sku,
        name: product.name,
        description: product.description,
        image_url: product.imageUrl,
        category: product.category,
        supplier_cost: product.supplierCost,
        base_price_pub: product.basePricePub,
        status: product.status || 'active',
        is_available: product.isAvailable ?? true,
        metadata: product.metadata
      }, {
        onConflict: 'sku'
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToEntity(data);
  }

  private mapToEntity(row: any): MasterProduct {
    return {
      id: row.id,
      supplierId: row.supplier_id,
      sku: row.sku,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      category: row.category,
      supplierCost: Number(row.supplier_cost),
      basePricePub: Number(row.base_price_pub),
      status: row.status,
      isAvailable: row.is_available,
      metadata: row.metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const masterProductRepository = new MasterProductRepository();
