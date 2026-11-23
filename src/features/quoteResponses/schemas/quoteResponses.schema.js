import { z } from 'zod';

export const quoteResponseItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  serial_number: z.number().optional().nullable(),
  request_id: z.string().uuid().or(z.string()),
  supplier_id: z.string().uuid().or(z.string()),
  unit_price_usd: z.number(),
  quantity: z.number(),
  total_amount_usd: z.number().optional(),
  status: z.string(),
  created_at: z.string(),
  supplier_name: z.string().nullable().optional(),
  request_product: z.string().nullable().optional(),
});

export const quoteResponsesListResponseSchema = z.object({
  items: z.array(quoteResponseItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
  totalPages: z.number().optional(),
});
