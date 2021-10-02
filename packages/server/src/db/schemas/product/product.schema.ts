import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Product,
  ProductStatus,
  Reaction,
  Review,
} from '../../../interfaces/product.interface';
import { User } from '../../../interfaces/user.interface';
import { UserModel } from '../user/user.schema';
import { ReactionSchema } from './reaction.schema';
import { ReviewSchema } from './review.schema';

@Schema({
  timestamps: true,
})
export class ProductModel extends Document implements Product {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  images: string[];

  @Prop({
    type: Types.ObjectId,
    ref: 'usermodels',
  })
  postedBy: User;

  @Prop()
  postedAt: Date;

  @Prop({
    enum: [
      ProductStatus.Draft,
      ProductStatus.InReview,
      ProductStatus.Published,
    ],
    type: String,
  })
  status: ProductStatus;

  @Prop()
  price: number;

  @Prop({ default: 0 }) //TODOT: Bigint
  overallRating: number;

  @Prop({
    type: [ReactionSchema],
  })
  reactions: Reaction[];

  @Prop({
    type: [
      {
        type: ReviewSchema,
      },
    ],
  })
  reviews: Review[];

  @Prop()
  categories: string[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
