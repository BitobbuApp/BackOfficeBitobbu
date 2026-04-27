import { z } from 'zod';

export const countrySchema = z.object({
  id: z.string().uuid().or(z.string()),
  code: z.string(),
  name: z.string(),
  is_active: z.boolean().or(z.string().transform(v => v === 'true' || v === '1')),
});

export const stateSchema = z.object({
  id: z.string().uuid().or(z.string()),
  country_code: z.string(),
  code: z.string(),
  name: z.string(),
  is_active: z.boolean().or(z.string().transform(v => v === 'true' || v === '1')),
});

export const countriesListResponseSchema = z.array(countrySchema);
export const statesListResponseSchema = z.array(stateSchema);
