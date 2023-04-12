import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
    }),
    JwtModule.register({}),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: 1000,
        store: (await redisStore({
          url: `redis://${configService.get('REDIS_HOST')}:${configService.get(
            'REDIS_PORT',
          )}`,
          username: configService.get('REDIS_USER'),
          password: configService.get('REDIS_PASSWORD'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, JwtModule, CacheModule],
})
export class CoreModule {}
