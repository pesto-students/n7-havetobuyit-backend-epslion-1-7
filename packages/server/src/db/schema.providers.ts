import {
  RevokedTokenModel,
  RevokedTokenSchema,
} from './schemas/revoked-token.schema';
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
];
