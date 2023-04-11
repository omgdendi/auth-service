import { z } from 'zod';
import { zodToOpenAPI } from 'nestjs-zod';

export const keyResponse = z
  .object({
    key: z
      .string()
      .length(8)
      .regex(/[a-z0-9]{8}$/)
      .describe('Unique request key'),
  })
  .strict();
export const keyResponseApi = {
  ...zodToOpenAPI(keyResponse),
  example: {
    key: 'eac39881',
  },
};
