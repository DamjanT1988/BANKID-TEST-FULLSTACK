import { z } from 'zod';

export const SessionStatus = z.object({
  status: z.enum(['pending', 'userSign', 'complete', 'failed']),
});

export type SessionStatus = z.infer<typeof SessionStatus>;
export type StatusResponse = SessionStatus;
