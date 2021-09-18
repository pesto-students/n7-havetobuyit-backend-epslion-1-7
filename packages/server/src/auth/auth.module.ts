import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../shared/strategies/local.strategy';

@Module({
  imports: [SharedModule, PassportModule],
  controllers: [AuthController],
  providers: [LocalStrategy],
})
export class AuthModule {}
