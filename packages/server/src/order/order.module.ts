import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ProductService } from '../shared/product/product.service';
import { OrderController } from './controller/order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [SharedModule.forRoot()],
})
export class OrderModule {}
