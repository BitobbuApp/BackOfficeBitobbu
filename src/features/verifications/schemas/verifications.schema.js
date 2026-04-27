import { z } from 'zod';

export const verificationItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  company_id: z.string().uuid().or(z.string()),
  company_name: z.string(),
  tax_id: z.string(),
  representative: z.string(),
  primary_contact: z.string().email(),
  submitted_at: z.string(),
  document_url: z.string().url().or(z.string()), // or string if it's #
  status: z.string(),
});

export const verificationsListResponseSchema = z.object({
  items: z.array(verificationItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
