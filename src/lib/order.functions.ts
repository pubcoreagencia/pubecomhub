import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { orderRepository } from "./repositories/orderRepository";
import { Order } from "@/types";

export const createOrderFn = createServerFn({ method: "POST" })
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
      productId: data.productId,
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
  .inputValidator((data) => z.object({
    storeId: z.string().optional(),
    influencerId: z.string().optional(),
  }).optional().parse(data))
  .handler(async ({ data }) => {
    if (data?.storeId) {
      return await orderRepository.getByStore(data.storeId);
    }
    if (data?.influencerId) {
      return await orderRepository.getByInfluencer(data.influencerId);
    }
    return await orderRepository.getAll();
  });
