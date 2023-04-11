import { User } from '../interfaces/user.interface';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { UserEntity } from './user.entity';
import { Token } from '../interfaces/token.interface';

@Entity('tokens')
export class TokenEntity extends BaseEntity implements Token {
  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user: User;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string | null;

  @Column({ type: 'varchar', nullable: false })
  user_agent: string;
}
