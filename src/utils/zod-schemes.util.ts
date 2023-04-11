import { string } from 'zod';

const UUID_LENGTH = 36;

export const zodUuid = string().uuid().length(UUID_LENGTH);
