import { z } from 'zod';

export const rfqItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  product_service: z.string(),
  buyer_company: z.string(),
  quantity: z.number(),
  unit: z.string(),
  status: z.string(),
  created_at: z.string(),
});

export const rfqsListResponseSchema = z.object({
  items: z.array(rfqItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
