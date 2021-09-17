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
