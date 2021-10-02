import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { importMongooseModule } from './db/database.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { StripeProductionSecretKey } from './shared/config/constants';

@Module({
  imports: [
    importMongooseModule(),
    SharedModule.forRoot(),
    StripeModule.forRoot({
      apiKey: StripeProductionSecretKey,
      apiVersion: '2020-08-27',
    }),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
