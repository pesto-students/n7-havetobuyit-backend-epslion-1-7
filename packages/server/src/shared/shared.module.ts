import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from '../db/database.module';
import { JwtModule } from '@nestjs/jwt';
import {
  AccessTokenExpirationTime,
  JWT_SECRET,
} from '../shared/config/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailService } from './mail/mail.service';
import { transportFactory } from './mail/transport.factory';
import { GoogleStrategy } from './strategies/google.strategy';
@Module({
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    transportFactory,
    MailService,
  ],
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: AccessTokenExpirationTime },
    }),
  ],
  exports: [DatabaseModule, AuthService, MailService],
})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
    };
  }
}
