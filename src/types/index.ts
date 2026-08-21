export type UserRole = 'MASTER' | 'LOJISTA' | 'FORNECEDOR' | 'AFILIADO' | 'INFLUENCER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  created_at?: string;
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  subdomain: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  supplierId: string;
  storeId: string;
  stock: number;
  image?: string;
  created_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  external_id?: string | null;
  storeId: string;
  productId?: string; // Legacy compatibility
  supplierId?: string;
  customerId: string;
  influencerId?: string | null;
  affiliateId?: string | null;
  amount: number;
  cost: number;
  shipping: number;
  tax: number;
  discount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  net_profit?: number;
  createdAt: string;
}

export interface Commission {
  id: string;
  orderId: string;
  profileId: string;
  amount: number;
  type: 'influencer' | 'affiliate';
  status: 'pending' | 'paid';
  created_at: string;
}

export interface FinancialMetric {
  grossRevenue: number;
  productCost: number;
  shipping: number;
  paymentFees: number;
  discounts: number;
  netProfit: number;
  margin: number;
  affiliateCommission: number;
  influencerPayout: number;
  pubEcomNetResult: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalCost: number;
  totalShipping: number;
  totalTax: number;
  totalDiscount: number;
  netProfit: number;
  pubResult: number;
  commissions: {
    influencers: number;
    afiliados: number;
  };
}

// Repository Interfaces for abstraction
export interface IOrderRepository {
  getAll(): Promise<Order[]>;
  getByStore(storeId: string): Promise<Order[]>;
  getByInfluencer(influencerId: string): Promise<Order[]>;
  create(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
}

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getByStore(storeId: string): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
}

export interface IStoreRepository {
  getById(id: string): Promise<Store | null>;
  getByOwner(ownerId: string): Promise<Store[]>;
  getBySubdomain(subdomain: string): Promise<Store | null>;
}
