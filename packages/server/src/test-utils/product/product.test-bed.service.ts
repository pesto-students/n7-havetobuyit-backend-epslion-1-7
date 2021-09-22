import { Injectable } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { User } from '../../interfaces/user.interface';
import { ProductRepository } from '../../db/services/product.repository';
import { mockProduct } from './product';
import { ProductModel } from '../../db/schemas/product/product.schema';

@Injectable()
export class ProductTestBedService {
  constructor(private readonly productRepository: ProductRepository) {}
  getModel() {
    return this.productRepository;
  }

  async insertProduct(byUserId: string) {
    const product = mockProduct();
    return {
      document: await this.productRepository.create({
        ...product,
        postedBy: (byUserId as unknown) as User,
      }),
      product,
    };
  }
  async insertNProducts(n = 10) {
    const docs = [];
    for (const _ of Array(n).keys()) {
      const product = mockProduct();
      docs.push({
        document: await this.productRepository.getModel().create(product),
        product,
      });
    }
    return docs;
  }
}
