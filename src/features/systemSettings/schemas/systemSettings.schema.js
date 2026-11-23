import { z } from 'zod';

export const systemSettingSchema = z.object({
  key: z.string(),
  group: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'json']),
  is_secret: z.boolean(),
  description: z.string().nullable().optional(),
  value: z.any().nullable(),
  source: z.string().optional(),
});

export const systemSettingsListSchema = z.array(systemSettingSchema);
