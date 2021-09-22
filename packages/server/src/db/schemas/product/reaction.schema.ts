import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../interfaces/user.interface';
import {
  AvailableReactions,
  Reaction,
} from '../../../interfaces/product.interface';
import { UserModel } from '../user/user.schema';

@Schema({
  timestamps: true,
})
export class ReactionModel extends Document implements Reaction {
  @Prop({
    type: Types.ObjectId,
    ref: 'usermodels',
  })
  user: User;

  @Prop({
    type: String,
  })
  reaction: AvailableReactions;
}

export const ReactionSchema = SchemaFactory.createForClass(ReactionModel);
