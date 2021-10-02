import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { schemaProviders } from './schema.providers';
import { UserRepository } from './services/user.repository';

import { DB_URL } from '../shared/config/constants';
import { RevokedTokenRepository } from './services/revoked-token.repository';
import { ProductRepository } from './services/product.repository';
import { OrderRepository } from './services/order.repository';

const PROVIDERS = [
  UserRepository,
  RevokedTokenRepository,
  ProductRepository,
  OrderRepository,
];

export const importMongooseModule = () =>
  MongooseModule.forRoot(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

@Module({
  imports: [MongooseModule.forFeature([...schemaProviders])],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class DatabaseModule {}
