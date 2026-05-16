import { z } from 'zod';

export const countrySchema = z.object({
  id: z.number().or(z.string()),
  iso_code: z.string(),
  name_es: z.string(),
  name_en: z.string().optional(),
  phone_code: z.string().optional(),
  is_active: z.boolean().or(z.string().transform(v => v === 'true' || v === '1')).optional(),
});

export const stateSchema = z.object({
  id: z.number().or(z.string()),
  country_id: z.number().or(z.string()),
  code: z.string(),
  name: z.string(),
  is_active: z.boolean().or(z.string().transform(v => v === 'true' || v === '1')).optional(),
});

export const countriesListResponseSchema = z.array(countrySchema);
export const statesListResponseSchema = z.array(stateSchema);
