export type UserRole = 'MASTER' | 'LOJISTA' | 'AFILIADO' | 'INFLUENCER';

export interface Store {
  id: string;
  name: string;
  subdomain: string;
  ownerId: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  supplierId: string;
  image: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  storeId: string;
  productId: string;
  customerId: string;
  amount: number;
  cost: number;
  shipping: number;
  tax: number;
  discount: number;
  status: 'pending' | 'paid' | 'purchased_from_supplier' | 'shipped' | 'delivered';
  createdAt: string;
  influencerId?: string;
  affiliateId?: string;
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
