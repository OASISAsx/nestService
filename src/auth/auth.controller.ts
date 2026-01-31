import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginGoogleDto } from './dto/loginGoogle.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);

    return {
      success: true,
      data: user,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);

    return {
      success: true,
      token: result.token,
      data: result.user,
    };
  }

  @Post('loginGoogle')
  async loginGoogle(@Body() dto: LoginGoogleDto) {
    const result = await this.authService.loginGoogle(dto);

    return {
      success: true,
      token: result.token,
      data: result.user,
    };
  }
}
