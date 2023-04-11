import { Base } from '../../../shared/entity/base.entity';
import { Token } from './token.interface';

export interface User extends Base {
  firstname: string;
  lastname: string;
  email: string;
  tokens: Token[];
}
