import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignUpDto } from '../dtos/signup.dto';
import { UsersService } from '../../users/users.service';
import { AuthExceptions } from '../auth.exceptions';
import { CodeService } from './code.service';
import { User } from '../../users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../../shared/mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly usersService: UsersService,
    private readonly codeService: CodeService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async requestReg(user: SignUpDto) {
    const userWithSameEmail = await this.usersService.findUser({
      email: user.email,
    });

    const { key, code } = await this.codeService.generateRegCache(user);

    if (userWithSameEmail) {
      throw new HttpException(
        AuthExceptions.EMAIL_IS_BUSY,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.sendCode(user.email, code);

    return {
      key,
    };
  }

  async requestAuth(email: string) {
    const user = await this.usersService.findUser({
      email,
    });

    if (!user) {
      throw new HttpException(
        AuthExceptions.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const { key, code } = await this.codeService.generateAuthCache(
      user.id,
      email,
    );

    await this.sendCode(user.email, code);

    return {
      key,
    };
  }

  async confirmCode(key: string, code: string, userAgent: string) {
    const cache = await this.codeService.getCache(key);

    if (!cache)
      throw new HttpException(
        AuthExceptions.TIME_TO_REQUEST_EXPIRED,
        HttpStatus.CONFLICT,
      );

    if (cache.code !== code)
      throw new HttpException(
        AuthExceptions.WRONG_CODE,
        HttpStatus.BAD_REQUEST,
      );

    if (cache.type === 'reg')
      return await this.createUser(cache.user, key, userAgent);

    if (cache.type === 'auth')
      return await this.getTokens(cache.id, key, userAgent);
  }

  async refreshTokens(userId: string, refreshToken: string, userAgent: string) {
    const user = await this.usersService.findUser(
      {
        id: userId,
      },
      ['tokens'],
    );

    const token = user?.tokens.find((token) => token.user_agent === userAgent);

    if (!token) {
      throw new HttpException(
        AuthExceptions.ACCESS_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    const isTokensMatch = await this.usersService.verifyRefreshTokens(
      token.refresh_token,
      refreshToken,
    );

    if (!isTokensMatch) {
      throw new HttpException(
        AuthExceptions.ACCESS_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    const tokens = await this.authorize(user.id);
    await this.usersService.updateRefreshToken(
      user,
      userAgent,
      tokens.refresh_token,
    );

    await this.cacheUser(user);

    return tokens;
  }

  async logout(user: User, userAgent: string) {
    await this.usersService.updateRefreshToken(user, userAgent, null);
  }

  private async sendCode(email: string, code: string) {
    this.mailService
      .sendMail(email, 'CODE', code, '')
      .then(() => console.log('Mail sent'))
      .catch(() => console.log("Mail didn't send"));
  }

  private async createUser(userDto: SignUpDto, key: string, userAgent: string) {
    const user = await this.usersService.createUser(userDto);

    await this.codeService.deleteCache(key);

    const tokens = await this.authorize(user.id);

    await this.usersService.updateRefreshToken(
      user,
      userAgent,
      tokens.refresh_token,
    );

    await this.cacheUser(user);

    return tokens;
  }

  private async getTokens(id: string, key: string, userAgent: string) {
    const user = await this.usersService.findUser({ id });

    if (!user)
      throw new HttpException(
        AuthExceptions.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    await this.codeService.deleteCache(key);

    const tokens = await this.authorize(user.id);

    await this.usersService.updateRefreshToken(
      user,
      userAgent,
      tokens.refresh_token,
    );

    await this.cacheUser(user);

    return tokens;
  }

  private async authorize(id: User['id']) {
    const payload = {
      id,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '1y',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async cacheUser(user: User) {
    await this.cacheManager.set(`USER_${user.id}`, user, 30 * 60);
  }
}
