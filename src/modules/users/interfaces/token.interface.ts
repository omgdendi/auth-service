import { Base } from '../../../shared/entity/base.entity';
import { User } from './user.interface';

export interface Token extends Base {
  user: User;
  refresh_token?: string;
  user_agent: string;
}
