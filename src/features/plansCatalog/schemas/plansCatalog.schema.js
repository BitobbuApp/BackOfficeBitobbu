import { z } from 'zod';

export const planItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  code: z.string(),
  name: z.string(),
  name_es: z.string().optional().default(''),
  price: z.number().or(z.string()),
  billing_cycle: z.number().optional(),
  // null = unlimited
  max_quotes_per_month: z.number().nullable().optional(),
  max_active_offers: z.number().nullable().optional(),
  is_default: z.boolean().optional(),
  sort_order: z.number().optional(),
  is_active: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const plansListResponseSchema = z.array(planItemSchema);
