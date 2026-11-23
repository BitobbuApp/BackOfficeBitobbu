import { z } from 'zod';

export const transactionItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  serial_number: z.number().optional().nullable(),
  buyer_name: z.string().nullable().optional(),
  supplier_name: z.string().nullable().optional(),
  product_description: z.string().nullable().optional(),
  total_amount_usd: z.number(),
  payment_currency: z.string().nullable().optional(),
  status: z.string(),
  delivery_time: z.string().nullable().optional(),
  estimated_delivery_date: z.string().nullable().optional(),
  created_at: z.string(),
});

export const transactionsListResponseSchema = z.object({
  items: z.array(transactionItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
  totalPages: z.number().optional(),
});
