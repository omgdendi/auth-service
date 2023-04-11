import { SignUpDto } from '../dtos/signup.dto';
import { User } from '../../users/interfaces/user.interface';

export type CachedReg = {
  type: 'reg';
  code: string;
  user: SignUpDto;
};
export type CachedAuth = {
  type: 'auth';
  code: string;
  id: User['id'];
  email: string;
};
