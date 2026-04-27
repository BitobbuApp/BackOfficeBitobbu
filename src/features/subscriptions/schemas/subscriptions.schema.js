import { z } from 'zod';

export const subscriptionItemSchema = z.object({
  company_id: z.string().uuid().or(z.string()),
  company_name: z.string(),
  plan_tier: z.string(),
  activation_date: z.string(),
  expiration_date: z.string(),
  status: z.string(),
});

export const subscriptionsListResponseSchema = z.object({
  items: z.array(subscriptionItemSchema).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
