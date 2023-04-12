import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            requestReg: jest.fn(),
            requestAuth: jest.fn(),
            confirmCode: jest.fn(),
            refreshTokens: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('requestReg', () => {
    it('should call authService.requestReg with correct arguments', async () => {
      const signUpDto = {
        firstname: 'Ivan',
        lastname: 'Ivanov',
        email: 'test@example.com',
      };

      await authController.requestReg(signUpDto);

      expect(authService.requestReg).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('requestAuth', () => {
    it('should call authService.requestAuth with correct arguments', async () => {
      const signInDto = {
        email: 'test@example.com',
      };

      await authController.requestAuth(signInDto);

      expect(authService.requestAuth).toHaveBeenCalledWith(signInDto.email);
    });
  });

  describe('confirm', () => {
    it('should call authService.confirmCode with correct arguments', async () => {
      const confirmCodeDto = {
        key: 'eac39881',
        code: '7777',
      };

      const mockReq = {
        get: jest.fn(() => 'Mozilla/5.0'),
      };

      await authController.confirm(
        confirmCodeDto,
        mockReq as unknown as Request,
      );

      expect(authService.confirmCode).toHaveBeenCalledWith(
        confirmCodeDto.key,
        confirmCodeDto.code,
        'Mozilla/5.0',
      );
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshTokens with correct arguments', async () => {
      const mockReq = {
        user: {
          id: 'user-id',
          refreshToken: 'refresh-token',
        },
        get: jest.fn(() => 'Mozilla/5.0'),
      };

      await authController.refreshToken(mockReq as unknown as Request);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockReq.user.id,
        mockReq.user.refreshToken,
        'Mozilla/5.0',
      );
    });
  });

  describe('logout', () => {
    it('should call authService.logout with correct arguments', async () => {
      const mockReq = {
        user: {
          id: 'user-id',
          refreshToken: 'refresh-token',
        },
        get: jest.fn(() => 'Mozilla/5.0'),
      };

      await authController.logout(mockReq as unknown as Request);

      expect(authService.logout).toHaveBeenCalledWith(
        mockReq.user,
        'Mozilla/5.0',
      );
    });
  });
});
