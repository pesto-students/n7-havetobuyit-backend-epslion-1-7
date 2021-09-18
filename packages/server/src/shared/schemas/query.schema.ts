import Joi from '@hapi/joi';
export interface ListQueryPayload {
  page: number;
  limit: number;
}

export const queryParamIdSchema = Joi.string().min(23).max(24).required();

export const optionalQueryParamIdSchema = Joi.string().min(23).max(24);

export const listQuerySchema = Joi.object<ListQueryPayload>({
  page: Joi.number().default(1),
  limit: Joi.number().default(30)
});
