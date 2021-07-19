import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/RegisterDto.dto';
import { FastifyRequest } from 'fastify';
import LocalAuthGuard from './localAuth.guard';
import User from '../users/user.entity';
import { GoogleService } from './google/google.service';

interface RequestWithUser extends FastifyRequest {
  user: User;
}

interface RequestWithCode extends FastifyRequest {
  query: {
    code: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return this.authService.login(request.user);
  }

  @Get('google-auth')
  googleAuth() {
    return this.googleService.generateAuthUrl();
  }

  @Get('google-redirect')
  async googleAuthRedirect(@Req() request: RequestWithCode) {
    const { code } = request.query;
    await this.googleService.setCredentials(code);
    const googleUser = await this.googleService.getGoogleUser();
    const user = await this.authService.registerGoogleUser(googleUser);
    return this.authService.login(user);
  }
}
