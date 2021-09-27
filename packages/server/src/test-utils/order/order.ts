import faker from 'faker';
import { Order, OrderStatus } from '../../interfaces/order.interface';

export const mockOrder = (): Omit<Order, 'product' | 'user'> => ({
  paymentProviderId: faker.datatype.uuid(),
  amount: faker.datatype.number(),
  status: OrderStatus.InShipping,
});
