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
  @Prop({
    type: {
      type: Types.ObjectId,
      ref: UserModel.name,
    },
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
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
