import faker from 'faker';
import { UserSchema } from 'src/db/schemas/user/user.schema';
import { User, UserRoles, UserStatus } from '../../interfaces/user.interface';

export const mockUser = (): User => ({
  orderedProducts: [],
  addresses: [],
  credentials: {
    email: faker.internet.email(),
    password: faker.internet.password(),
  },
  firstName: faker.name.firstName(),
  lastLogin: null,
  lastName: faker.name.lastName(),
  lifetimeValue: 0,
  role: UserRoles.User,
  status: UserStatus.Activated,
});
