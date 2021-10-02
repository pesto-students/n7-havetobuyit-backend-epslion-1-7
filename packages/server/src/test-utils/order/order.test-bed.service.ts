import { Injectable } from '@nestjs/common';
import { Order } from '../../interfaces/order.interface';
import { User } from '../../interfaces/user.interface';
import { mockOrder } from './order';
import { OrderModel } from '../../db/schemas/order/order.schema';
import { OrderRepository } from '../../db/services/order.repository';
import { Product } from '../../interfaces/product.interface';

@Injectable()
export class OrderTestBedService {
  constructor(private readonly orderRepository: OrderRepository) {}
  getModel() {
    return this.orderRepository;
  }

  async insertOrder(byUserId: string, productId: string) {
    const order = mockOrder();
    return {
      document: await this.orderRepository.create({
        ...order,
        user: (byUserId as unknown) as User,
        product: (productId as unknown) as Product,
      }),
      order,
    };
  }
  async insertNOrders(n = 10) {
    const docs = [];
    for (const _ of Array(n).keys()) {
      const order = mockOrder();
      docs.push({
        document: await this.orderRepository.getModel().create(order),
        order,
      });
    }
    return docs;
  }
  async insertAnonymousOrder(productId: string) {
    const order = mockOrder();
    return {
      document: await this.orderRepository.create({
        ...order,
        product: (productId as unknown) as Product,
      }),
      order,
    };
  }
}
