import { z } from 'zod';

export const verificationItemSchema = z.object({
  company_id: z.string().uuid().or(z.string()),
  trade_name: z.string().nullable().optional(),
  legal_name: z.string().nullable().optional(),
  tax_id: z.string().nullable().optional(),
  status: z.string(),
  document_count: z.number().optional(),
  updated_at: z.string().optional(),
});

export const companyDocumentSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  type_id: z.number(),
  url: z.string().url(),
  status: z.string(),
  notes: z.string().nullable().optional(),
  reviewed_at: z.string().nullable().optional(),
  reviewed_by: z.string().nullable().optional(),
  created_at: z.string(),
  type: z.object({
    id: z.number(),
    name_en: z.string(),
    name_es: z.string(),
    instructions: z.string().nullable().optional(),
  }),
});

export const verificationsListResponseSchema = z.object({
  items: z.array(verificationItemSchema),
  page: z.number().optional(),
  limit: z.number().optional(),
  total: z.number().optional(),
  total_pages: z.number().optional(),
});
