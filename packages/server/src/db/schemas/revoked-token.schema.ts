import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Token } from '../../interfaces/token.interface';

@Schema()
export class RevokedTokenModel extends Document implements Token {
  @Prop()
  token: string;
}

export const RevokedTokenSchema = SchemaFactory.createForClass(
  RevokedTokenModel,
);
