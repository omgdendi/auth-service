import { z } from 'zod';
import { zodUuid } from '../../utils/zod-schemes.util';
import { zodToOpenAPI } from 'nestjs-zod';

export const userSchema = z.object({
  id: zodUuid,
  firstname: z.string().trim().min(1, 'Firstname is required').max(350),
  lastname: z.string().trim().min(1, 'Lastname is required').max(350),
  email: z.string().email().min(1, 'Email is required').max(350),
});

export const userApiExample = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  firstname: 'Ivan',
  lastname: 'Ivanov',
  email: 'test@test.com',
};

export const userApi = {
  ...zodToOpenAPI(userSchema),
  example: userApiExample,
};

export type FindUserType = z.infer<typeof userSchema>;
