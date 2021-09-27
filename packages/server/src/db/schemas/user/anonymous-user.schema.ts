import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address, AnonymousUser } from '../../../interfaces/user.interface';
import { AddressSchema } from './address.schema';

@Schema({
  timestamps: true,
})
export class AnonymousUserModel extends Document implements AnonymousUser {
  @Prop()
  email: string;

  @Prop()
  mobileNo: string;

  @Prop({
    type: AddressSchema,
  })
  address: Address;
}

export const AnonymousUserSchema = SchemaFactory.createForClass(
  AnonymousUserModel,
);
