import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { userApiExample, userSchema } from '../../users/user.schema';

const signInSchema = userSchema
  .pick({
    email: true,
  })
  .strict();
export class SignInDto extends createZodDto(signInSchema) {}
export const signInApi = {
  ...zodToOpenAPI(signInSchema),
  example: {
    email: userApiExample.email,
  },
};
