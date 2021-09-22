import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../interfaces/user.interface';
import { Review } from '../../../interfaces/product.interface';
import { UserModel, UserSchema } from '../user/user.schema';

@Schema()
export class ReviewModel extends Document implements Review {
  @Prop({
    type: {
      type: Types.ObjectId,
      ref: 'usermodels',
    },
  })
  byUser: User;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({
    max: 5,
    min: 1,
  })
  rating: number;

  @Prop()
  images: string[];
}
export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
