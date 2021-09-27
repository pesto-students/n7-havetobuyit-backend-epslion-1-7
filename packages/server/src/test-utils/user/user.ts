import faker from 'faker';
import { UserSchema } from 'src/db/schemas/user/user.schema';
import {
  User,
  UserRoles,
  UserStatus,
  Address,
} from '../../interfaces/user.interface';

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

export const mockAddress = (): Address => ({
  line1: faker.address.streetAddress(),
  line2: faker.address.secondaryAddress(),
  city: faker.address.city(),
  country: faker.address.country(),
  label: faker.random.word(),
  state: faker.address.state(),
  zip: faker.address.zipCode(),
});
