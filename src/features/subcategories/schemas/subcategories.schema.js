import { z } from 'zod';

export const subcategorySchema = z.object({
  id: z.number(),
  category_id: z.number(),
  slug: z.string(),
  name_es: z.string(),
  name_en: z.string(),
  sort_order: z.number(),
  is_active: z.boolean(),
  category_name: z.string().nullable().optional(),
  // How many companies work with it (impact shown before deactivating)
  company_count: z.number().nullable().optional(),
});

export const subcategoriesListResponseSchema = z.array(subcategorySchema);
