import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { orderRepository } from "./repositories/orderRepository";
import { Order } from "@/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const createOrderFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    storeId: z.string(),
    customerId: z.string(),
    productId: z.string().optional(),
    amount: z.number(),
    cost: z.number(),
    shipping: z.number(),
    tax: z.number(),
    discount: z.number(),
    influencerId: z.string().optional(),
    affiliateId: z.string().optional(),
    external_id: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    // Process server-side business rules here if needed
    // Net profit is calculated by the database via generated column
    
    const order = await orderRepository.create({
      storeId: data.storeId,
      customerId: data.customerId,
      productId: data.productId ?? null,
      amount: data.amount,
      cost: data.cost,
      shipping: data.shipping,
      tax: data.tax,
      discount: data.discount,
      status: 'paid',
      influencerId: data.influencerId ?? null,
      affiliateId: data.affiliateId ?? null,
      external_id: data.external_id ?? null,
    });

    
    return order;
  });

export const getOrdersFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    storeId: z.string().optional(),
    influencerId: z.string().optional(),
  }).optional().parse(data))
  .handler(async ({ data, context }) => {
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', context.userId).single();
    const userRole = profile?.role;

    if (data?.storeId) {
      // LOJISTA só vê ordens da sua própria loja
      if (userRole === 'LOJISTA') {
        const { data: store } = await supabaseAdmin.from('stores').select('owner_id').eq('id', data.storeId).single();
        if (store?.owner_id !== context.userId) {
          throw new Error("Forbidden");
        }
      }
      return await orderRepository.getByStore(data.storeId);
    }
    
    if (data?.influencerId) {
      // INFLUENCER só vê suas próprias ordens
      if (userRole === 'INFLUENCER' && data.influencerId !== context.userId) {
        throw new Error("Forbidden");
      }
      return await orderRepository.getByInfluencer(data.influencerId);
    }

    // MASTER vê tudo
    if (userRole === 'MASTER') {
      return await orderRepository.getAll();
    }
    
    throw new Error("Unauthorized access to all orders");
  });
