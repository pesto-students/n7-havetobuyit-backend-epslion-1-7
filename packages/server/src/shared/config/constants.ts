import { config } from 'dotenv';
import ms from 'ms';
import { AvailableReactions } from '../../interfaces/product.interface';

process.env.NODE_ENV === 'test'
  ? config({
      path: __dirname + '/../../../.test.env',
    })
  : config({
      path: __dirname + '/../../../.prod.env',
    });

export const MandrillProductionApiKey = process.env.MandrillProductionApiKey;
export const MandrillTestApiKey = process.env.MandrillTestApiKey;
export const StripeTestSecretKey = process.env.StripeTestSecretKey;
export const StripeProductionSecretKey = process.env.StripeProductionSecretKey;

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
  PRODUCT_NOT_EXIST: 9,
  NO_IAMGES_ADDED_TO_PRODUCT: 10,
  CANNOT_ADD_REVIEW_TO_PRODUCT: 11,
  INVALID_PRODUCT_FOR_PUBLISH: 12,
  CANNOT_UPDATE_NON_DRAFT_PRODUCT: 13,
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
export const ProductErrors = {
  NOT_EXIST: {
    message: 'Specified product does not exist',
    code: ErrorCodes.PRODUCT_NOT_EXIST,
  },
  NO_IMAGES_ADDED_TO_PRODUCT: {
    message: 'Specified product should contain atlease one image to publish',
    code: ErrorCodes.NO_IAMGES_ADDED_TO_PRODUCT,
  },
  CANNOT_ADD_REVIEW_TO_PRODUCT: {
    message: 'User has not bought the product',
    code: ErrorCodes.CANNOT_ADD_REVIEW_TO_PRODUCT,
  },
  INVALID_PRODUCT_FOR_PUBLISH: {
    message: 'User has not posted this product',
    code: ErrorCodes.INVALID_PRODUCT_FOR_PUBLISH,
  },
  CANNOT_UPDATE_NON_DRAFT_PRODUCT: {
    message:
      'Cannot update in-review/published product. Please unpublish this product before editing.',
    code: ErrorCodes.CANNOT_UPDATE_NON_DRAFT_PRODUCT,
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
  [ErrorCodes.PRODUCT_NOT_EXIST]: 404,
  [ErrorCodes.NO_IAMGES_ADDED_TO_PRODUCT]: 409,
  [ErrorCodes.CANNOT_ADD_REVIEW_TO_PRODUCT]: 400,
  [ErrorCodes.INVALID_PRODUCT_FOR_PUBLISH]: 400,
  [ErrorCodes.CANNOT_UPDATE_NON_DRAFT_PRODUCT]: 409,
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

export const ReactionsMapping = {
  [AvailableReactions.Happy]: 1,
  [AvailableReactions.Sad]: -1,
  [AvailableReactions.Neutral]: 0,
};

export const ReactionWeight = 1.25;
export const ReviewWeight = 1.5;

export const DefaultProductsLimit = 10;
export const DefaultProductSkip = 0;
