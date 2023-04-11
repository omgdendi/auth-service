import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { CodeService } from './services/code.service';
import { UsersModule } from '../users/users.module';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { MailModule } from '../../shared/mail/mail.module';

@Module({
  imports: [UsersModule, MailModule],
  providers: [
    AuthService,
    CodeService,
    UsersModule,
    AccessJwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
