import { Order } from '@/types';
import { mockOrders } from '@/data/mock';

export class OrderRepository {
  async getAll(): Promise<Order[]> {
    return [...mockOrders];
  }

  async getByStore(storeId: string): Promise<Order[]> {
    return mockOrders.filter((o: Order) => o.storeId === storeId);
  }

  async getByInfluencer(influencerId: string): Promise<Order[]> {
    return mockOrders.filter((o: Order) => o.influencerId === influencerId);
  }
}

export const orderRepository = new OrderRepository();
