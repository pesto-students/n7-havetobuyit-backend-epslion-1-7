import * as Joi from '@hapi/joi';
import {
  MinPasswordLength,
  MaxPasswordLength,
} from '../../shared/config/constants';
import {
  LoginCredentials,
  CreateAccountCredentials,
} from '../../interfaces/auth.interface';

export const loginSchema = Joi.object<LoginCredentials>({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(MinPasswordLength)
    .max(MaxPasswordLength)
    .required(),
});

export const createAccountSchema = Joi.object<CreateAccountCredentials>({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(MinPasswordLength)
    .max(MaxPasswordLength)
    .required(),
  firstName: Joi.string()
    .min(3)
    .required(),
  lastName: Joi.string()
    .min(3)
    .required(),
});

export const resetPasswordEmailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

export const tokenSchema = Joi.string()
  .min(10)
  .required();
export const resetPasswordSchema = Joi.object<{ password: string }>({
  password: Joi.string()
    .min(MinPasswordLength)
    .max(MaxPasswordLength)
    .required(),
});

export const paramEmailSchema = Joi.string()
  .email()
  .required();
