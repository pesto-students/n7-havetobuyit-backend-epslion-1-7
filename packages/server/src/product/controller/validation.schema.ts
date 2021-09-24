import Joi from 'joi';
import {
  AvailableReactions,
  Product,
  Review,
} from '../../interfaces/product.interface';

export const createProductSchema = Joi.object<Product>({
  title: Joi.string().min(5),
  description: Joi.string().min(10),
  images: Joi.array()
    .items(Joi.string())
    .min(1),
}).required();
export const productIdSchema = Joi.object({
  productId: Joi.string(),
});

export const idSchema = Joi.string();
export const reactionSchema = Joi.object({
  reaction: Joi.string().valid(
    AvailableReactions.Happy,
    AvailableReactions.Neutral,
    AvailableReactions.Sad,
  ),
});
export const reviewSchema = Joi.object<Omit<Review, 'byUser'>>({
  title: Joi.string().min(4),
  description: Joi.string().min(100),
  images: Joi.array()
    .items(Joi.string())
    .min(1),
  rating: Joi.number()
    .min(1)
    .max(5),
});
export const updateProductSchema = Joi.object<Partial<Product>>({
  title: Joi.string().min(5),
  description: Joi.string().min(10),
  images: Joi.array()
    .items(Joi.string())
    .min(1),
}).required();
