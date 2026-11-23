import { z } from 'zod';

export const subscriptionItemSchema = z.object({
  id: z.string(),
  company_id: z.string().uuid().or(z.string()),
  company_name: z.string(),
  plan_code: z.string(),
  plan_name: z.string(),
  amount: z.number().optional(),
  activation_date: z.string(),
  // null for the free plan: it never expires
  expiration_date: z.string().nullable(),
  is_active: z.boolean(),
  status: z.string(),
});

export const subscriptionsListResponseSchema = z.object({
  items: z.array(subscriptionItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});

export const subscriptionHistorySchema = z.array(
  z.object({
    id: z.string(),
    plan_code: z.string(),
    plan_name: z.string(),
    amount: z.number(),
    payment_reference: z.string().nullable(),
    status: z.string(),
    is_active: z.boolean(),
    current_period_start: z.string(),
    current_period_end: z.string().nullable(),
    created_at: z.string(),
  })
);
