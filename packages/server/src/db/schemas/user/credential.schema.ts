import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Credentials, SocialLogins } from '../../../interfaces/user.interface';

@Schema()
export class CredentialsModel extends Document implements Credentials {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop({
    select: 0,
  })
  password?: string;

  @Prop({
    enum: [SocialLogins.Google],
    type: String,
  })
  registeredThrough: SocialLogins.Google;
}

export const CredentialsSchema = SchemaFactory.createForClass(CredentialsModel);
