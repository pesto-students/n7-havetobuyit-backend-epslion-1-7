import faker from 'faker';
import { Order, OrderStatus } from '../../interfaces/order.interface';
import { mockAddress } from '../user/user';

export const mockOrder = (): Omit<Order, 'product' | 'user'> => ({
  paymentProviderId: faker.datatype.uuid(),
  amount: faker.datatype.number(),
  status: OrderStatus.InShipping,
});

export const mockAnonymousOrder = (): Omit<Order, 'product'> => ({
  amount: faker.datatype.number(),
  status: OrderStatus.Confirmed,
  anonymousUser: {
    address: mockAddress(),
    email: faker.internet.email(),
    mobileNo: faker.phone.phoneNumber(),
  },
  paymentProviderId: faker.datatype.uuid(),
});
