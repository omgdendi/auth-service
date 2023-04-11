import { createZodValidationPipe } from 'nestjs-zod';
import { UnprocessableEntityException } from '@nestjs/common';

export const SchemaValidationPipe = createZodValidationPipe({
  createValidationException: (err) => {
    console.log(err);
    return new UnprocessableEntityException('Ошибка валидации');
  },
});
