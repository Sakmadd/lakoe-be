import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(4).max(20),
});
