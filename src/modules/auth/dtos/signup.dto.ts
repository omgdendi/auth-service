import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { userApiExample, userSchema } from '../../users/user.schema';

const signUpSchema = userSchema
  .omit({
    id: true,
  })
  .strict();
export class SignUpDto extends createZodDto(signUpSchema) {}
export const signUpApi = {
  ...zodToOpenAPI(signUpSchema),
  example: {
    firstname: userApiExample.firstname,
    lastname: userApiExample.lastname,
    email: userApiExample.email,
  },
};
