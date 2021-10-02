import { INestApplication } from '@nestjs/common';
import mongoose from 'mongoose';
import faker from 'faker';
import { getAccessTokenByLogin, getTokenFromHTML } from '../../test-utils/auth';
import { OrderTestBedService } from '../../test-utils/order/order.test-bed.service';
import { AuthController } from '../../auth/controller/auth.controller';
import { ProductController } from '../../product/controller/product.controller';
import { ProductService } from '../../shared/product/product.service';
import {
  buildMockTransportFactory,
  makeTestModule,
  cleanupDB,
  testPost,
  testGet,
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
import { OrderStatus } from 'src/interfaces/order.interface';

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

  // Remove anonymous 
  // Remove payment
  // Send email on order to product 
  // All orders are pay on delivery

  describe('Public Routes', () => {
    let userObj: { document: UserModel; user: User };
    let productObj: { document: ProductModel; product: Product };
    let verificationToken;
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
        .expect(201)
        .expect(() => {
          expect(sendMailSpy).toHaveBeenCalled();
          const { html } = sendMailSpy.mock.calls[0][0].message;
          expect(html).toBeDefined();
          const token = getTokenFromHTML(html, '/verify');
          expect(token).toBeDefined();
          expect(token.length).toBeGreaterThan(2);
          verificationToken = token;
        });
    });
    it('should verify order and add order with shipping status when POST /order/verify', async () => {
      return testPost(app, '/order/verify', () => '')
        .send({
          token: verificationToken,
        })
        .expect(200)
        .expect(async ({ body }) => {
          expect(sendMailSpy).toHaveBeenCalled();
          expect(body.status).toBe(OrderStatus.Confirmed.toString());
          expect(body._id).toBeTruthy();
          const orderDoc = orderTestBedService
            .getModel()
            .findOne({ _id: body._id });
          expect(orderDoc).not.toBeNull();
        });
    });
    it('should send verification mail on anonymous order cancellation when POST /order/cancel', async () => {
      const { document } = await orderTestBedService.insertAnonymousOrder(
        productObj.document._id,
      );
      return testPost(app, '/order/cancel', () => '')
        .send({ _id: document._id })
        .expect(201);
    });
  });
});
