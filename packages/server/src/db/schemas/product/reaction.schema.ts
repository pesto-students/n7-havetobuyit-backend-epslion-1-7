import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../../interfaces/user.interface';
import {
  AvailableReactions,
  Reaction,
} from '../../../interfaces/product.interface';
import { UserModel, UserSchema } from '../user/user.schema';

@Schema()
export class ReactionModel extends Document implements Reaction {
  @Prop({
    type: [
      {
        type: UserSchema,
        ref: UserModel.name,
      },
    ],
  })
  user: User;

  @Prop({
    type: String,
  })
  reaction: AvailableReactions;
}

export const ReactionSchema = SchemaFactory.createForClass(ReactionModel);
