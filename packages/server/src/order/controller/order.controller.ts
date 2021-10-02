import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from '../order.service';
import { StripeEventGuard } from '../stripe-event.pipe';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/webhook')
  stripeEventHandler(@Body() body, @Req() req) {
    console.log(req.body);
  }

  @Post('/checkout')
  async createStripeCheckoutSession() {
    return;
  }
}
