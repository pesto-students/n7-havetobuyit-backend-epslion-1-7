import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { SharedModule } from '../shared/shared.module';
import { ProductRepository } from '../db/services/product.repository';

@Module({
  imports: [SharedModule.forRoot()],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
