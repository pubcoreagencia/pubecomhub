import { Store, Product, Supplier, Order, FinancialMetric } from '../types';

export const mockStores: Store[] = [
  { id: 's1', name: 'Loja Tech', subdomain: 'tech', ownerId: 'u1', createdAt: '2026-01-01T12:00:00.000Z', status: 'active' },
  { id: 's2', name: 'Moda Fashion', subdomain: 'moda', ownerId: 'u2', createdAt: '2026-01-02T12:00:00.000Z', status: 'active' },
];

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Smartphone Pro', price: 2999, cost: 1500, supplierId: 'sup1', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { id: 'p2', name: 'Tênis Ultra', price: 499, cost: 200, supplierId: 'sup2', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
];

export const mockSuppliers: Supplier[] = [
  { id: 'sup1', name: 'Global Tech Distribution' },
  { id: 'sup2', name: 'Premium Footwear Inc' },
];

export const mockOrders: Order[] = [
  {
    id: '1245',
    storeId: 's1',
    productId: 'p1',
    customerId: 'cust1',
    amount: 2999,
    cost: 1500,
    shipping: 50,
    tax: 150,
    discount: 100,
    status: 'delivered',
    createdAt: '2026-08-20T14:30:00.000Z',
    influencerId: 'inf1'
  },
  {
    id: '1246',
    storeId: 's2',
    productId: 'p2',
    customerId: 'cust2',
    amount: 499,
    cost: 200,
    shipping: 20,
    tax: 25,
    discount: 0,
    status: 'shipped',
    createdAt: '2026-08-20T16:45:00.000Z',
  },
  {
    id: '1247',
    storeId: 's1',
    productId: 'p1',
    customerId: 'cust3',
    amount: 2999,
    cost: 1500,
    shipping: 50,
    tax: 150,
    discount: 300,
    status: 'paid',
    createdAt: '2026-08-21T09:15:00.000Z',
    influencerId: 'inf2'
  },
];

export const calculateFinance = (orders: Order[]): FinancialMetric => {
  const gross = orders.reduce((sum, o) => sum + o.amount, 0);
  const costs = orders.reduce((sum, o) => sum + o.cost, 0);
  const ship = orders.reduce((sum, o) => sum + o.shipping, 0);
  const fees = orders.reduce((sum, o) => sum + (o.amount * 0.05), 0); // 5% flat fee
  const discounts = orders.reduce((sum, o) => sum + o.discount, 0);
  
  const netProfit = gross - costs - ship - fees - discounts;
  
  const infPayout = orders.filter(o => o.influencerId).reduce((sum, o) => {
    const saleNet = o.amount - o.cost - o.shipping - (o.amount * 0.05) - o.discount;
    return sum + (saleNet * 0.5);
  }, 0);
  
  const affComm = orders.filter(o => o.affiliateId).reduce((sum, o) => sum + (o.amount * 0.1), 0); // 10%
  
  const pubEcomNet = netProfit - infPayout - affComm;

  return {
    grossRevenue: gross,
    productCost: costs,
    shipping: ship,
    paymentFees: fees,
    discounts: discounts,
    netProfit: netProfit,
    margin: gross > 0 ? (netProfit / gross) * 100 : 0,
    affiliateCommission: affComm,
    influencerPayout: infPayout,
    pubEcomNetResult: pubEcomNet
  };
};
