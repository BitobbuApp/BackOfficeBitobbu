import { z } from 'zod';

export const planItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string(),
  price: z.number().or(z.string()),
  billing_cycle: z.number().optional(),
  is_active: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const plansListResponseSchema = z.array(planItemSchema);
