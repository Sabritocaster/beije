import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.usersService.register(dto);
    return {
      message: 'Registration successful. Please verify your email.',
      user,
    };
  }

  @Get('verify-email/:username/:token')
  async verifyEmail(
    @Param('username') username: string,
    @Param('token') token: string
  ) {
    const user = await this.usersService.verifyEmail(username, token);
    return { message: 'Email verified successfully.', user };
  }

  @Get('check-verification/:username')
  async checkVerification(@Param('username') username: string) {
    const user = await this.usersService.isVerified(username);
    return {
      isVerified: user.isVerified,
      message: user.isVerified ? 'user is verified' : 'user is not verified',
    };
  }
}
