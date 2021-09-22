import faker from 'faker';
import {
  Product,
  ProductStatus,
  Review,
} from '../../interfaces/product.interface';

export const mockProduct = (): Omit<Product, 'postedBy'> => ({
  title: faker.random.words(4),
  description: faker.lorem.sentences(),
  overallRating: faker.datatype.number(),
  postedAt: new Date(),
  reactions: [],
  reviews: [],
  status: ProductStatus.Draft,
});

export const mockReview = (): Omit<Review, 'byUser'> => ({
  description: faker.lorem.sentences(),
  images: [],
  rating: faker.datatype.number(),
  title: faker.random.words(4),
});
