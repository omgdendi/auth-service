import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { v4 } from 'uuid';
import { SignUpDto } from '../dtos/signup.dto';
import { CachedAuth, CachedReg } from '../types/caсhe.type';
@Injectable()
export class CodeService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateRegCache(user: SignUpDto) {
    const key = this.generateKey();
    const code = this.generateCode();

    await this.cacheManager.set(
      `AUTH_${key}`,
      {
        type: 'reg',
        code,
        user,
      },
      1000 * 60 * 10,
    );
    return {
      key,
      code,
    };
  }

  async generateAuthCache(id: string, email: string) {
    const key = this.generateKey();
    const code = this.generateCode();
    console.log(`AUTH_${key}`);
    await this.cacheManager.set(
      `AUTH_${key}`,
      {
        type: 'auth',
        code,
        email,
        id,
      },
      1000 * 60 * 10,
    );
    return { key, code };
  }

  async getCache(key: string) {
    const cache = await this.cacheManager.get<CachedReg | CachedAuth>(
      `AUTH_${key}`,
    );

    return cache;
  }

  async deleteCache(key: string) {
    await this.cacheManager.del(`AUTH_${key}`);
  }

  private generateCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code.toString();
  }

  private generateKey() {
    return v4().slice(0, 8);
  }
}
