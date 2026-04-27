import { z } from 'zod';

export const planItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string(),
  code: z.string(),
  price_usd_monthly: z.number(),
  trial_days: z.number(),
  max_users: z.number(),
  status: z.string(),
});

export const plansListResponseSchema = z.object({
  items: z.array(planItemSchema).optional(),
});
