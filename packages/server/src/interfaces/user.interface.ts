import { Product } from './product.interface';

export interface User {
  status: UserStatus;
  userRegisteredAt?: Date;
  lifetimeValue: number;
  lastLogin: Date;
  credentials: Credentials;
  role: UserRoles;
  addresses: Address[];
  firstName: string;
  lastName: string;
  orderedProducts: Product[];
}

export enum SocialLogins {
  Google = 'google',
}

export enum UserStatus {
  Activated = 'Activated',
  Inactivated = 'Inactivated',
  Suspended = 'Suspended',
}
export interface Credentials {
  email: string;
  password?: string;
  registeredThrough?: SocialLogins.Google;
}
export enum UserRoles {
  User = 'User',
  Admin = 'Admin',
}
export interface Address {
  label: string;
  line1: string;
  line2?: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}
export interface AnonymousUser {
  email: string;
  mobileNo: string;
  address: Address;
}
