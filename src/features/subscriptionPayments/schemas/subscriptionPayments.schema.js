import { z } from 'zod';

export const paymentItemSchema = z.object({
  id: z.string(),
  plan: z.object({ id: z.string(), code: z.string(), name: z.string(), name_es: z.string() }).optional(),
  company: z.object({ id: z.string(), trade_name: z.string(), tax_id: z.string().nullable().optional() }),
  amount_usd: z.number(),
  amount_ves: z.number().nullable(),
  exchange_rate: z.number().nullable(),
  bank_code: z.string(),
  reference: z.string(),
  payer_phone: z.string(),
  payer_document: z.string(),
  paid_at: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  rejection_reason: z.string().nullable(),
  reviewed_at: z.string().nullable(),
  created_at: z.string(),
});

export const paymentsListResponseSchema = z.object({
  items: z.array(paymentItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
