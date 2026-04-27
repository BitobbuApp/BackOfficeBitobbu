import { z } from 'zod';

export const transactionItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  buyer_company: z.string(),
  supplier_company: z.string(),
  total_amount_usd: z.number(),
  currency: z.string(),
  status: z.string(),
  created_at: z.string(),
});

export const transactionsListResponseSchema = z.object({
  items: z.array(transactionItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
