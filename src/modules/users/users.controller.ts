import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { userApi, userSchema } from './user.schema';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  @UseGuards(AccessJwtGuard)
  @Get('account')
  @ApiOperation({
    summary: 'Get info about your account',
  })
  @ApiCreatedResponse({ schema: userApi })
  async getAccount(@Req() req) {
    return userSchema.strip().parse(req.user);
  }
}
