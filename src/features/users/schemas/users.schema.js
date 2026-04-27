import { z } from 'zod';

export const userItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  company_name: z.string(),
  trade_name: z.string(),
  email: z.string().email(),
  profile_type: z.string(),
  registration_date: z.string(),
  status: z.string(),
});

export const usersListResponseSchema = z.object({
  items: z.array(userItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  total_pages: z.number(),
});

export const userDetailResponseSchema = userItemSchema.extend({
  contacts: z.array(z.string()),
  locations: z.array(z.string()),
  payment_preferences: z.array(z.string()),
});
