import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [AuthModule],
  providers: [GoogleService, AuthService],
  controllers: [GoogleController],
})
export class GoogleModule {}
