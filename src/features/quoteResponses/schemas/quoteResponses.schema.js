import { z } from 'zod';

export const quoteResponseItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  rfq_id: z.string().uuid().or(z.string()),
  supplier_company: z.string(),
  price_usd: z.number(),
  quantity: z.number(),
  status: z.string(),
  created_at: z.string(),
});

export const quoteResponsesListResponseSchema = z.object({
  items: z.array(quoteResponseItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
