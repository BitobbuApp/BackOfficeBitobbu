import { z } from 'zod';

export const dashboardKpisResponseSchema = z.object({
  total_users: z.number(),
  active_users: z.number(),
  pending_verifications: z.number(),
  total_companies: z.number(),
  rfqs_last_30_days: z.number(),
  quotes_last_30_days: z.number(),
  total_gmv_usd: z.number(),
});
