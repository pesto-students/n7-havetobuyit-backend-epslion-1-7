import { INestApplication } from '@nestjs/common';
import mongoose from 'mongoose';
import faker from 'faker';
import { getAccessTokenByLogin } from '../../test-utils/auth';
import { OrderTestBedService } from '../../test-utils/order/order.test-bed.service';
import { AuthController } from '../../auth/controller/auth.controller';
import { ProductController } from '../../product/controller/product.controller';
import { ProductService } from '../../product/service/product.service';
import {
  buildMockTransportFactory,
  makeTestModule,
  cleanupDB,
  testPost,
} from '../../test-utils/common';
import { ProductTestBedService } from '../../test-utils/product/product.test-bed.service';
import { UserTestBedService } from '../../test-utils/user/user.test-bed.service';
import { OrderController } from './order.controller';
import { OrderService } from '../order.service';
import { UserModel } from 'src/db/schemas/user/user.schema';
import { User } from 'src/interfaces/user.interface';
import { ProductModel } from 'src/db/schemas/product/product.schema';
import { Product } from 'src/interfaces/product.interface';
import { mockAddress } from 'src/test-utils/user/user';

describe('OrderController', () => {
  let app: INestApplication;
  let userTestBedService: UserTestBedService;
  let productTestBedService: ProductTestBedService;
  let orderTestBedService: OrderTestBedService;
  let sendMailSpy;

  beforeEach(async () => {
    const { transporter, spy } = await buildMockTransportFactory();
    sendMailSpy = spy;
    app = await makeTestModule(
      [AuthController, OrderController],
      [
        OrderService,
        OrderTestBedService,
        UserTestBedService,
        ProductTestBedService,
        transporter,
      ],
    );
    await app.init();
    userTestBedService = app.get(UserTestBedService);
    productTestBedService = app.get(ProductTestBedService);
    orderTestBedService = app.get(OrderTestBedService);
  });

  afterEach(async () => {
    await cleanupDB(mongoose);
  });

  describe('User Routes', () => {
    let userObj;
    let getCachedToken;
    beforeEach(async () => {
      userObj = await userTestBedService.insertUser();

      const {
        user: { credentials },
      } = userObj;
      getCachedToken = await getAccessTokenByLogin(
        app,
        credentials.email,
        credentials.password,
      );
    });

    it('');
  });

  describe('Public Routes', () => {
    let userObj: { document: UserModel; user: User };
    let productObj: { document: ProductModel; product: Product };
    beforeEach(async () => {
      userObj = await userTestBedService.insertUser();
      productObj = await productTestBedService.insertProduct(
        userObj.document._id,
      );
    });
    it('should be able to place an order without login when POST /order/anonymous', async () => {
      return testPost(app, '/order/anonymous', () => '')
        .send({
          address: mockAddress(),
          productId: faker.datatype.uuid(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          mobile: faker.phone.phoneNumber(),
        })
        .expect(201);
      // TODO
    });
  });
});
