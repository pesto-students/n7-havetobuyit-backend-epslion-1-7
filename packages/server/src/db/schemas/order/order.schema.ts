import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../../interfaces/product.interface';
import { AnonymousUser, User } from '../../../interfaces/user.interface';
import { Order, OrderStatus } from '../../../interfaces/order.interface';
import { AnonymousUserSchema } from '../user/anonymous-user.schema';

@Schema({
  timestamps: true,
})
export class OrderModel extends Document implements Order {
  @Prop()
  paymentProviderId: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'usermodels',
  })
  user?: User;

  @Prop({
    type: AnonymousUserSchema,
  })
  anonymousUser?: AnonymousUser;

  @Prop({
    type: Types.ObjectId,
    ref: 'productmodels',
  })
  product: Product;

  @Prop()
  amount: number;

  @Prop({
    type: String,
    enum: [
      OrderStatus.Confirmed,
      OrderStatus.InShipping,
      OrderStatus.Shipped,
      OrderStatus.Delivered,
    ],
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel);
