import { z } from 'zod';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { keyResponse } from './key-response.dto';

const confirmCode = z
  .object({
    code: z
      .string()
      .length(4, 'Invalid code')
      .regex(/[0-9]{4}$/, 'Invalid code')
      .describe(`4-digit code sent to the user's email`),
  })
  .merge(keyResponse)
  .strict();
export class ConfirmCodeDto extends createZodDto(confirmCode) {}
export const confirmCodeApi = {
  ...zodToOpenAPI(confirmCode),
  example: {
    code: '7777',
    key: 'eac39881',
  },
};
