import { z } from 'zod';

export const dashboardKpisResponseSchema = z.object({
  total_users: z.number(),
  rfqs_last_7_days: z.number(),
  quotes_last_7_days: z.number(),
  suppliers_pending_verification: z.number(),
});
