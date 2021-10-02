import { Product } from './product.interface';
import { User, Address, AnonymousUser } from './user.interface';

export enum OrderStatus {
  Confirmed = 'confirmed',
  InShipping = 'in-shipping',
  Shipped = 'shipped',
  Delivered = 'delivered',
}

export interface Order {
  paymentProviderId: string;
  product: Product;
  user?: User;
  anonymousUser?: AnonymousUser;
  status: OrderStatus;
  // in rupees
  amount: number;
}

export interface CheckoutPayload {
  productId: string;
  quantity: number;
}