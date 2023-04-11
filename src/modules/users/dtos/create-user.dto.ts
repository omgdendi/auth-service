import { userSchema } from '../user.schema';
import { z } from 'zod';

export const createUserSchema = userSchema.omit({ id: true }).strict();

export type CreateUserType = z.infer<typeof createUserSchema>;
