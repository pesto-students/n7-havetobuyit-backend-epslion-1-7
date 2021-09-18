import { AppError } from '../config/constants';
import VError from 'verror';

export const makeVError = (error: AppError) => {
  return new VError(
    {
      info: {
        code: error.code,
      },
    },
    error.message,
  );
};
