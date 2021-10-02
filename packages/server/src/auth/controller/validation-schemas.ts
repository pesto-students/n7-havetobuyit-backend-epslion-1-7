import * as Joi from 'joi';
import j2s from 'joi-to-swagger';
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

export const { swagger: loginSwaggerSchema } = j2s(loginSchema);

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
export const { swagger: createAccountSwaggerSchema } = j2s(createAccountSchema);

export const resetPasswordEmailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});
export const { swagger: resetPasswordEmailSwaggerSchema } = j2s(
  resetPasswordEmailSchema,
);

export const tokenSchema = Joi.string()
  .min(10)
  .required();
export const resetPasswordSchema = Joi.object<{ password: string }>({
  password: Joi.string()
    .min(MinPasswordLength)
    .max(MaxPasswordLength)
    .required(),
});
export const { swagger: resetPasswordSwaggerSchema } = j2s(resetPasswordSchema);

export const paramEmailSchema = Joi.string()
  .email()
  .required();
