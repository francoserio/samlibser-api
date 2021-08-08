import { Controller, forwardRef, Get, Inject, Post, Req } from '@nestjs/common';
import { GoogleService } from './google.service';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../auth.service';

interface RequestWithCode extends FastifyRequest {
  query: {
    code: string;
  };
}

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Get('auth')
  googleAuth() {
    return this.googleService.generateAuthUrl();
  }

  @Get('callback')
  async googleAuthRedirect(@Req() request: RequestWithCode) {
    const { code } = request.query;
    await this.googleService.setCredentials(code);
  }

  @Post('google-login')
  async googleLogin() {
    const googleUser = await this.googleService.getGoogleUser();
    const user = await this.authService.registerGoogleUser(googleUser);
    return this.authService.login(user);
  }
}
