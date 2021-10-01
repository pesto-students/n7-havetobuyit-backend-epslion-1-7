import mongoose from 'mongoose';
import { DB_URL } from '../shared/config/constants';
import { Product } from '../interfaces/product.interface';
import productsData from './products.json';
import { ProductStatus } from '../interfaces/product.interface';
import { mockUser } from '../test-utils/user/user';
import { User } from '../interfaces/user.interface';

(async () => {
  try {
    // Add some users and get their ids
    // make list of products according to Products
    // Insert
    await mongoose.connect(DB_URL);

    const users: User[] = Array.from(new Array(10), _ => mockUser());
    const docs = await mongoose.connection
      .collection('usermodels')
      .insertMany(users);
    console.log(docs);

    const products: Omit<Product, 'postedBy'>[] = Array.from(productsData).map(
      (product, index) => ({
        title: product.title,
        description: product.body_html,
        price: product.price_max,
        images: product.images_info.map(img => img.src),
        postedBy: (docs.insertedIds[index] as unknown) as User,
        status: ProductStatus.Published,
        overallRating: 0,
        reactions: [],
        reviews: [],
        postedAt: new Date(),
      }),
    );
    await mongoose.connection.collection('productmodels').insertMany(products);
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(0);
  }
})();
