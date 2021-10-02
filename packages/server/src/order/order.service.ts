import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { CheckoutPayload } from 'src/interfaces/order.interface';
import { ProductService } from 'src/shared/product/product.service';
import { UserService } from 'src/user/service/user.service';
import Stripe from 'stripe';

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
