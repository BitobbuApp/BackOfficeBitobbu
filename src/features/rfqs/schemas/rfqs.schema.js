import { z } from 'zod';

export const rfqItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  serial_number: z.number().optional().nullable(),
  product_service: z.string(),
  company: z.object({
    id: z.string(),
    trade_name: z.string().nullable().optional(),
  }).optional(),
  quantity: z.number(),
  unit: z.string(),
  status: z.string(),
  created_at: z.string(),
  expiration_date: z.string().optional(),
  response_count: z.number().optional(),
  category: z.string().nullable().optional(),
});

export const rfqsListResponseSchema = z.object({
  items: z.array(rfqItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
