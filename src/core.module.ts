import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
    }),
    JwtModule.register({}),
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 15,
    }),
  ],
  exports: [ConfigModule, JwtModule, CacheModule],
})
export class CoreModule {}
