import { z } from 'zod';

export const LoginDto = z.object({
  personNumber: z.string(),
});

export type LoginDto = z.infer<typeof LoginDto>;
