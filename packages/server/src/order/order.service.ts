import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { CheckoutPayload } from '../interfaces/order.interface';
import { ProductService } from '../shared/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly productService: ProductService,
  ) {}
  async createStripeCheckoutSession(products: CheckoutPayload[]) {
    return;
  }
}
