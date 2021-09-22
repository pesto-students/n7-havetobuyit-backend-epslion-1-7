import ms from 'ms';
import { AvailableReactions } from '../../interfaces/product.interface';
export const MandrillProductionApiKey = process.env.MandrillProductionApiKey;
export const MandrillTestApiKey = process.env.MandrillTestApiKey;

export const ReactionToSentimentMapping = {
  [AvailableReactions.Sad]: -1,
  [AvailableReactions.Neutral]: 0,
  [AvailableReactions.Happy]: 1,
};

export const DB_URL =
  process.env.MONGODB_URL || 'mongodb://localhost/havtobuyit-dev-db';

export interface AppError {
  message: string;
  code: number;
}

const ErrorCodes = {
  ACCOUNT_NOT_FOUND: 1,
  INVALID_PASSWORD: 2,
  DUPLICATE_ACCOUNT: 3,
  INVALID_PASS_RESET_TOKEN: 4,
  INVALID_REFRESH_TOKEN: 5,
  USER_DOES_NOT_EXIST: 6,
  INVALID_EMAIL_VERIFICATION_TOKEN: 7,
};

export const AuthenticationErrors = {
  ACCOUNT_DOES_NOT_EXIST: {
    message: 'INVALID EMAIL/PASSWORD COMBINATION',
    code: ErrorCodes.ACCOUNT_NOT_FOUND,
  },
  INVALID_PASSWORD: {
    message: 'INVALID EMAIL/PASSWORD COMBINATION',
    code: ErrorCodes.INVALID_PASSWORD,
  },
  ACCOUNT_EXIST: {
    message: 'AN ACCOUNT WITH THIS EMAIL ID EXISTS',
    code: ErrorCodes.DUPLICATE_ACCOUNT,
  },
  INVALID_PASSWORD_RESET_TOKEN: {
    message: 'Invalid password reset token provided',
    code: ErrorCodes.INVALID_PASS_RESET_TOKEN,
  },
  INVALID_REFRESH_TOKEN: {
    message: 'Invalid refresh token. You must login again',
    code: ErrorCodes.INVALID_REFRESH_TOKEN,
  },
  INVALID_EMAIL_VERIFICATION_TOKEN: {
    message: 'Invalid email verification token',
    code: ErrorCodes.INVALID_EMAIL_VERIFICATION_TOKEN,
  },
};
export const UserErrors = {
  NOT_EXIST: {
    message: 'Specified user does not exist',
    code: ErrorCodes.USER_DOES_NOT_EXIST,
  },
};

export const SALT_ROUNDS = 10;

export const JWT_SECRET =
  process.env.JWT_SECRET || 'nfjln#@$^&^%*bhBW$#@QB45tADFF31*()&*$%';
export const REFRESH_JWT_SECRET =
  process.env.REFRESH_JWT_SECRET || 'fasdfDSFASD$#Q$%#!%$#AGFDGFGHSFdsfdsdsg';
export const ResetPasswordTokenExpirationTime = '15m';
export const RefreshTokenExpirationTime = '7d';
export const AccessTokenExpirationTime = ms('1d');
export const UserRefreshTokenCookieName = 'jid_u';

export const ClientDomainName =
  process.env.CLIENT_DOMAIN_NAME || 'http://localhost:3000/';

export const HTTP_EXCEPTIONS_MAPPING = {
  [ErrorCodes.ACCOUNT_NOT_FOUND]: 404,
  [ErrorCodes.INVALID_PASSWORD]: 404,
  [ErrorCodes.DUPLICATE_ACCOUNT]: 409,
  [ErrorCodes.USER_DOES_NOT_EXIST]: 404,
  [ErrorCodes.INVALID_PASS_RESET_TOKEN]: 401,
  [ErrorCodes.INVALID_REFRESH_TOKEN]: 406,
  [ErrorCodes.INVALID_EMAIL_VERIFICATION_TOKEN]: 401,
};
export const MailOptions = {
  from_email: 'support@havetobuyit.com',
  from_name: 'HaveToBuyIT!',
};

export const EmailVerificationTemplate = '';
export const ResetPasswordTemplate = 'reset-password.template.html';
export const HtmlTemplateLinkPlaceholder = '#$@link@$#';

export const MinPasswordLength = 8;
export const MaxPasswordLength = 128;
