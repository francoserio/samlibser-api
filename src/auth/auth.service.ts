import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import RegisterDto from './dto/RegisterDto.dto';
import LoginDto from './dto/LoginDto.dto';
import GoogleProfileDto from './google/dto/GoogleProfileDto.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: LoginDto) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOne(email);
      await this.verifyPassword(password, user.password);
      return user;
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async registerGoogleUser(googleProfile: GoogleProfileDto) {
    try {
      let user = await this.usersService.findOne(
        googleProfile.emailAddresses[0].value,
      );
      if (!user) {
        user = await this.usersService.create({
          email: googleProfile.emailAddresses[0].value,
          firstName: googleProfile.names[0].givenName,
          lastName: googleProfile.names[0].familyName,
        });
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const passwordMatches = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!passwordMatches) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
