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
import { ProductService } from './product/product.service';
@Module({
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    transportFactory,
    MailService,
    ProductService,
  ],
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: AccessTokenExpirationTime },
    }),
  ],
  exports: [DatabaseModule, AuthService, MailService, ProductService],
})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
    };
  }
}
