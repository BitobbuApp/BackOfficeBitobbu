import { z } from 'zod';

export const authAdminSchema = z.object({
  id: z.string().uuid().or(z.string()),
  email: z.string().email(),
  full_name: z.string(),
  role: z.string(),
  status: z.string().optional(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  admin: authAdminSchema,
});

export const getMeResponseSchema = z.object({
  admin: authAdminSchema,
});
