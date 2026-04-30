import { z } from 'zod';

export const lookupItemSchema = z.object({
  id: z.string().uuid().or(z.string()),
  code: z.string(),
  label: z.string(),
  is_active: z.boolean().or(z.string().transform(v => v === 'true' || v === '1')), // Depending on how backend sends it, usually boolean
});

export const lookupsListResponseSchema = z.array(lookupItemSchema);
