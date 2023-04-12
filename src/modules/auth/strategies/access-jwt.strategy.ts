import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '../../users/interfaces/user.interface';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload.id) throw new UnauthorizedException();

    let user = await this.cacheManager.get<User>(`USER_${payload.id}`);

    if (!user) user = await this.usersService.findUser({ id: payload.id });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
