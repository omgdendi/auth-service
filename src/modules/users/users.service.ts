import { Injectable } from '@nestjs/common';
import { FindUserType } from './user.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { CreateUserType } from './dtos/create-user.dto';
import * as argon2 from 'argon2';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private tokensRepository: Repository<TokenEntity>,
  ) {}

  async createUser(user: CreateUserType) {
    const userEntity = this.usersRepository.create(user);
    return await this.usersRepository.save(userEntity);
  }

  async findUser(where: FindUserType, relations?: string[]) {
    return await this.usersRepository.findOne({ where, relations });
  }

  async updateRefreshToken(
    user: User,
    user_agent: string,
    refresh_token: string | null,
  ) {
    if (refresh_token) refresh_token = await argon2.hash(refresh_token);

    const tokens = await this.tokensRepository.findBy({ user });

    let token = tokens.find((token) => token.user_agent === user_agent);

    if (!token) {
      token = this.tokensRepository.create({
        user,
        user_agent,
      });
    }

    token.refresh_token = refresh_token;

    await this.tokensRepository.save(token);
  }

  async verifyRefreshTokens(firstToken: string, secondToken: string) {
    return await argon2.verify(firstToken, secondToken);
  }
}
