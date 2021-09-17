import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from '../../../interfaces/user.interface';
import { Document } from 'mongoose';

@Schema()
export class AddressModel extends Document implements Address {
  @Prop({})
  label: string;

  @Prop()
  line1: string;

  @Prop()
  line2: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zip: string;

  @Prop()
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(AddressModel);
