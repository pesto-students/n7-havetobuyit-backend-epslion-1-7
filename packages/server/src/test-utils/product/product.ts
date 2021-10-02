import faker from 'faker';
import {
  Product,
  ProductStatus,
  Review,
} from '../../interfaces/product.interface';

export const mockProduct = (): Omit<Product, 'postedBy'> => ({
  title: faker.random.words(4),
  description: faker.lorem.sentences(5),
  overallRating: faker.datatype.number(),
  postedAt: new Date(),
  reactions: [],
  reviews: [],
  status: ProductStatus.Draft,
  images: [faker.internet.url()],
  price: faker.datatype.number(),
  categories: [faker.random.word()],
});

export const mockReview = (): Omit<Review, 'byUser'> => ({
  description: faker.lorem.sentences(50),
  images: [],
  rating: faker.datatype.number({ min: 1, max: 5 }),
  title: faker.lorem.sentences(4),
});
