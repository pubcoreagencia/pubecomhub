export type AppRole = 'MASTER' | 'LOJISTA' | 'FORNECEDOR' | 'AFILIADO' | 'INFLUENCER';

export interface User {
  id: string;
  name: string;
  role: AppRole;
  email: string;
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  subdomain: string;
  status: 'active' | 'inactive';
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  supplierId: string;
  stock: number;
  image?: string;
}

export interface Order {
  id: string;
  storeId: string;
  productId: string;
  supplierId: string;
  customerId: string;
  influencerId?: string;
  afiliadoId?: string;
  amount: number;
  cost: number;
  shipping: number;
  tax: number;
  discount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
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
