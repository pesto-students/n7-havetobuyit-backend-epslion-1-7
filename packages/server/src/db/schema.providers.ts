import { OrderModel, OrderSchema } from './schemas/order/order.schema';
import { ProductModel, ProductSchema } from './schemas/product/product.schema';
import {
  ReactionModel,
  ReactionSchema,
} from './schemas/product/reaction.schema';
import { ReviewModel, ReviewSchema } from './schemas/product/review.schema';
import {
  RevokedTokenModel,
  RevokedTokenSchema,
} from './schemas/revoked-token.schema';
import {
  AnonymousUserModel,
  AnonymousUserSchema,
} from './schemas/user/anonymous-user.schema';
import { UserModel, UserSchema } from './schemas/user/user.schema';

export const schemaProviders = [
  {
    name: UserModel.name,
    schema: UserSchema,
  },
  {
    name: RevokedTokenModel.name,
    schema: RevokedTokenSchema,
  },
  {
    name: ProductModel.name,
    schema: ProductSchema,
  },
  {
    name: ReactionModel.name,
    schema: ReactionSchema,
  },
  {
    name: ReviewModel.name,
    schema: ReviewSchema,
  },
  { name: AnonymousUserModel.name, schema: AnonymousUserSchema },
  { name: OrderModel.name, schema: OrderSchema },
];
