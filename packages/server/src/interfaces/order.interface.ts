import { Product } from './product.interface';
import { User, Address, AnonymousUser } from './user.interface';

export enum OrderStatus {
  Verifying = 'verifying',
  InShipping = 'in-shipping',
  Shipped = 'shipped',
  Delivered = 'delivered',
}

export interface Order {
  paymentProviderId: string;
  product: Product;
  user: User | AnonymousUser;
  status: OrderStatus;
  // in rupees
  amount: number;
}
