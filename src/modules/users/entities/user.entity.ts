import { User } from '../interfaces/user.interface';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Token } from '../interfaces/token.interface';
import { TokenEntity } from './token.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements User {
  @Column({ type: 'varchar', nullable: true, unique: true })
  @Index('uniq_email', { unique: true, where: '(email IS NOT NULL)' })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  firstname: string;

  @Column({ type: 'varchar', nullable: false })
  lastname: string;

  @OneToMany(() => TokenEntity, (token) => token.user, {
    onDelete: 'SET NULL',
  })
  tokens: Token[];
}
