import { Order, IOrderRepository } from '@/types';
import { mockOrders } from '@/data/mock';
import { supabase } from '@/integrations/supabase/client';

export class OrderRepository implements IOrderRepository {
  private useMock = true; // Toggle for easy migration

  async getAll(): Promise<Order[]> {
    if (this.useMock) {
      return [...mockOrders];
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapDbOrderToType);
  }

  async getByStore(storeId: string): Promise<Order[]> {
    if (this.useMock) {
      return mockOrders.filter((o: Order) => o.storeId === storeId);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapDbOrderToType);
  }

  async getByInfluencer(influencerId: string): Promise<Order[]> {
    if (this.useMock) {
      return mockOrders.filter((o: Order) => o.influencerId === influencerId);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapDbOrderToType);
  }

  async create(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    if (this.useMock) {
      const newOrder: Order = {
        ...order,
        id: `MOCK-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      // We don't push to mockOrders as it's static in mock.ts, 
      // but a real app would update a local cache.
      return newOrder;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        external_id: order.external_id,
        store_id: order.storeId,
        customer_id: order.customerId,
        influencer_id: order.influencerId,
        affiliate_id: order.affiliateId,
        amount: order.amount,
        cost: order.cost,
        shipping: order.shipping,
        tax: order.tax,
        discount: order.discount,
        status: order.status,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbOrderToType(data);
  }

  private mapDbOrderToType(dbOrder: any): Order {
    return {
      id: dbOrder.id,
      external_id: dbOrder.external_id,
      storeId: dbOrder.store_id,
      customerId: dbOrder.customer_id,
      influencerId: dbOrder.influencer_id,
      affiliateId: dbOrder.affiliate_id,
      amount: Number(dbOrder.amount),
      cost: Number(dbOrder.cost),
      shipping: Number(dbOrder.shipping),
      tax: Number(dbOrder.tax),
      discount: Number(dbOrder.discount),
      status: dbOrder.status,
      net_profit: Number(dbOrder.net_profit),
      createdAt: dbOrder.created_at,
    };
  }
}

export const orderRepository = new OrderRepository();
