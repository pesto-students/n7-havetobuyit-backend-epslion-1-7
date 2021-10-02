import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Observable } from 'rxjs';
import { StripeProductionSecretKey } from 'src/shared/config/constants';
import { makeVError } from 'src/shared/utils/error';
import Stripe from 'stripe';

@Injectable()
export class StripeEventGuard implements CanActivate {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const signature =
      request.rawHeaders[
        (request.rawHeaders as string[]).indexOf('Stripe-Signature') + 1
      ];

    console.log(request.rawBody, 'ra');
    let event;

    try {
      event = this.stripeClient.webhooks.constructEvent(
        request.body,
        signature,
        StripeProductionSecretKey,
      );
    } catch (err) {
      throw makeVError({
        message: `Webhook error: ${err.message}`,
        code: 500,
      });
    }
    request.stripe_event = event;
    return true;
  }
}
