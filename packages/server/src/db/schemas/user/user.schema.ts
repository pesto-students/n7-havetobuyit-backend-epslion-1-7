import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../../interfaces/product.interface';
import {
  User,
  Credentials,
  UserRoles,
  UserStatus,
  Address,
} from '../../../interfaces/user.interface';
import { ProductModel, ProductSchema } from '../product/product.schema';
import { AddressSchema } from './address.schema';
import { CredentialsSchema } from './credential.schema';

@Schema({
  timestamps: true,
})
export class UserModel extends Document implements User {
  @Prop({
    type: String,
    enum: [UserStatus.Activated, UserStatus.Inactivated, UserStatus.Suspended],
    default: UserStatus.Inactivated,
  })
  status: UserStatus;

  @Prop({
    type: Date,
    default: Date.now,
  })
  userRegisteredAt: Date;

  @Prop({
    type: [Types.ObjectId],
    ref: ProductModel.name,
  })
  orderedProducts: Product[];

  @Prop()
  lifetimeValue: number;

  @Prop({
    select: 0,
  })
  lastLogin: Date;

  @Prop({
    type: CredentialsSchema,
  })
  credentials: Credentials;

  @Prop({
    type: String,
    enum: [UserRoles.User, UserRoles.Admin],
    default: UserRoles.User,
  })
  role: UserRoles;

  @Prop({
    type: [AddressSchema],
  })
  addresses: Address[];

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
