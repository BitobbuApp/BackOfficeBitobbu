import { z } from 'zod';

export const userItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  email: z.string().email(),
  company_id: z.string().uuid().nullable().optional(),
  company_name: z.string().nullable().optional(),
  status: z.string(),
  verification_status: z.string().optional(),
  created_at: z.string(),
});

export const usersListResponseSchema = z.object({
  items: z.array(userItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  total_pages: z.number(),
});

export const companyDetailSchema = z.object({
  id: z.string(),
  company_name: z.string().nullable().optional(),
  trade_name: z.string().nullable().optional(),
  status: z.string().optional(),
  tax_id: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  locations: z.array(z.any()).optional(),
  contacts: z.array(z.any()).optional(),
  payment_methods: z.array(z.any()).optional(),
});

export const userDetailResponseSchema = z.object({
  id: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  email: z.string().email(),
  status: z.string(),
  registration_date: z.string().optional(),
  company: companyDetailSchema.nullable().optional(),
});

