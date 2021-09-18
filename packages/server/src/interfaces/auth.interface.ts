export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface CreateAccountCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResult {
  readonly result: LoginSuccess | AuthFailure;
}

export interface LoginSuccess {
  readonly id: string;
  readonly email: string;
  readonly role: string;
  readonly accountHolderName: string;
  readonly accessTokenExpiration?: number;
}

export interface AuthFailure {
  readonly message: string;
  readonly code: number;
}

export interface CreateAccountSuccess {
  userId: string;
}
export interface CreateAccountResult {
  readonly result: CreateAccountSuccess | AuthFailure;
}

export interface AccessTokenPayload {
  readonly sub?: string;
  readonly email: string;
  readonly accountHolderName?: string;
  readonly role: string;
}

export interface EmailVerificationTokenPayload {
  emailId: string;
  userId: string;
}

export interface VerifyTokenPayload {
  token: string;
}

export interface GoogleLoginPayload {
  email: string;
  firstName: string;
  lastName: string;
  access_token: string;
}
