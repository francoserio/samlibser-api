import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/RegisterDto.dto';
import { FastifyRequest } from 'fastify';
import LocalAuthGuard from './localAuth.guard';
import User from '../users/user.entity';

interface RequestWithUser extends FastifyRequest {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return this.authService.login(request.user);
  }
}
