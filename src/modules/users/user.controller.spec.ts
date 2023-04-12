import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { userSchema } from './user.schema';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { Reflector } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AccessJwtGuard,
          useValue: {
            canActivate: jest.fn(),
          },
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAccount', () => {
    it('should return the user account info', async () => {
      const user = {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        firstname: 'Ivan',
        lastname: 'Ivanov',
        email: 'test@test.com',
      };
      const strippedUser = userSchema.strip().parse(user);

      const result = await controller.getAccount({ user });

      expect(result).toEqual(strippedUser);
    });
  });
});
