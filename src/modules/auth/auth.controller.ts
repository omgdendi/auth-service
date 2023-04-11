import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { signUpApi, SignUpDto } from './dtos/signup.dto';
import { signInApi, SignInDto } from './dtos/signin.dto';
import { AuthService } from './services/auth.service';
import { confirmCodeApi, ConfirmCodeDto } from './dtos/confirm-code.dto';
import { RefreshJwtGuard } from '../../guards/refresh-jwt.guard';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { tokenResponseApi } from './dtos/tokens-response.dto';
import { keyResponseApi } from './dtos/key-response.dto';
import { AuthExceptions } from './auth.exceptions';
import { ZodExceptions } from '../../exceptions/zod.exception';

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary:
      'Request registration and send a confirmation code to the selected email',
    description: 'return session key for confirm',
  })
  @ApiBody({ schema: signUpApi })
  @ApiCreatedResponse({ schema: keyResponseApi })
  @ApiBadRequestResponse({ description: AuthExceptions.EMAIL_IS_BUSY.message })
  @ApiUnprocessableEntityResponse({
    description: ZodExceptions.VALIDATION_FAILED.message,
  })
  async requestReg(@Body() user: SignUpDto) {
    return await this.authService.requestReg(user);
  }

  @Post('signin')
  @ApiOperation({
    summary:
      'Request authorization and send a confirmation code to the selected email',
    description: 'return session key for confirm',
  })
  @ApiBody({ schema: signInApi })
  @ApiCreatedResponse({ schema: keyResponseApi })
  @ApiNotFoundResponse({ description: AuthExceptions.USER_NOT_FOUND.message })
  @ApiUnprocessableEntityResponse({
    description: ZodExceptions.VALIDATION_FAILED.message,
  })
  async requestAuth(@Body() { email }: SignInDto) {
    return await this.authService.requestAuth(email);
  }

  @Post('confirm')
  @ApiOperation({
    summary:
      'Check the validity of the confirmation code and take the appropriate action',
    description: 'Need code from email and key from previous step',
  })
  @ApiBody({ schema: confirmCodeApi })
  @ApiCreatedResponse({ schema: tokenResponseApi })
  @ApiConflictResponse({
    description: AuthExceptions.TIME_TO_REQUEST_EXPIRED.message,
  })
  @ApiBadRequestResponse({ description: AuthExceptions.WRONG_CODE.message })
  @ApiUnprocessableEntityResponse({
    description: ZodExceptions.VALIDATION_FAILED.message,
  })
  async confirm(@Body() { key, code }: ConfirmCodeDto, @Req() req) {
    const userAgent = req.get('user-agent');
    return await this.authService.confirmCode(key, code, userAgent);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Need refresh token in Authorization header',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ schema: tokenResponseApi })
  @ApiForbiddenResponse({ description: AuthExceptions.ACCESS_DENIED.message })
  async refreshToken(@Req() req) {
    const user = req.user;
    const userAgent = req.get('user-agent');
    return await this.authService.refreshTokens(
      user.id,
      user.refreshToken,
      userAgent,
    );
  }

  @UseGuards(AccessJwtGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Remove refresh token',
  })
  @ApiBearerAuth()
  async logout(@Req() req) {
    const user = req.user;
    const userAgent = req.get('user-agent');
    await this.authService.logout(user, userAgent);
    return 'ok';
  }
}
