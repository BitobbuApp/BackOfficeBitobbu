import { z } from 'zod';

export const lookupTableRowSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
}).catchall(z.any());

export const lookupsListResponseSchema = z.array(lookupTableRowSchema);
