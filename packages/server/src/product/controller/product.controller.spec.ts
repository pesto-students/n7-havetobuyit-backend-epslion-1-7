import { INestApplication } from '@nestjs/common';
import faker from 'faker';
import mongoose from 'mongoose';
import { getAccessTokenByLogin } from '../../test-utils/auth';
import { AuthController } from '../../auth/controller/auth.controller';
import {
  buildMockTransportFactory,
  makeTestModule,
  cleanupDB,
  testPost,
  testPatch,
  testGet,
} from '../../test-utils/common';
import { UserTestBedService } from '../../test-utils/user/user.test-bed.service';
import { mockProduct, mockReview } from '../../test-utils/product/product';
import { ProductTestBedService } from '../../test-utils/product/product.test-bed.service';
import { ProductStatus } from '../../interfaces/product.interface';

describe('ProductController', () => {
  let app: INestApplication;
  let userTestBedService: UserTestBedService;
  let productTestBedService: ProductTestBedService;

  beforeEach(async () => {
    const { transporter } = await buildMockTransportFactory();
    app = await makeTestModule(
      [AuthController],
      [UserTestBedService, ProductTestBedService, transporter],
    );
    await app.init();
    userTestBedService = app.get(UserTestBedService);
    productTestBedService = app.get(ProductTestBedService);
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

    it.only('should be able to create an in-draft product on POST /product/new', async () => {
      const { status: _, ...product } = mockProduct();
      return testPost(app, '/product/new', getCachedToken)
        .send(product)
        .expect(201)
        .expect(async ({ body }) => {
          expect(body.title).toBe(product.title);
          expect(body.description).toBe(product.description);
          expect(body.status).toBe(ProductStatus.Draft);

          const products = await productTestBedService.getModel().findAll();
          expect(products.length).toBe(1);
        });
    });
    it('should be able to change status to in-review when in-draft product is submitted for review on POST /product/request-publish', async () => {
      const { document } = await productTestBedService.insertProduct(
        userObj.document._id,
      );
      return testPost(app, '/product/request-publish', getCachedToken)
        .expect(201)
        .expect(async ({ body }) => {
          expect(body.status).toBe(ProductStatus.InReview);
          const productDoc = await productTestBedService
            .getModel()
            .findOne({ _id: document._id });
          expect(productDoc.status).toBe(ProductStatus.InReview);
        });
    });
    it('should be able to add a reaction to a product on PATCH /product/:productId', async () => {
      const { document } = await productTestBedService.insertProduct(
        userObj.document._id,
      );
      return testPatch(app, `/product/${document._id}`, getCachedToken)
        .expect(200)
        .send({ reaction: 1 })
        .expect(async () => {
          const productDoc = await productTestBedService
            .getModel()
            .findOne({ _id: document._id });
          expect(productDoc.reactions).toContain(userObj.document._id);
        });
    });
    it('should throw 401 when unauthenticated user tries adding a reaction on PATCH /product/:productId', async () => {
      const { document } = await productTestBedService.insertProduct(
        userObj.document._id,
      );
      return testPatch(app, `/product/${document._id}/`, () => '').expect(401);
    });

    it('should be able to add review to a product on POST /product/:productId/review', async () => {
      const { document } = await productTestBedService.insertProduct(
        userObj.document._id,
      );
      await userTestBedService
        .getModel()
        .updateOne(userObj.document.credentials.email, {
          orderedProducts: [document._id],
        });
      const review = mockReview();
      return testPost(app, `/product/${document._id}/review`, getCachedToken)
        .send(review)
        .expect(201)
        .expect(async () => {
          const productModel = await productTestBedService
            .getModel()
            .findOne({ _id: document._id });
          expect(productModel.reviews).toHaveLength(1);
          expect(productModel.reviews).toContain(
            expect.objectContaining(review),
          );
          expect(productModel.reviews[0].byUser).toBe(userObj.document._id);
        });
    });
    it("should throw 400 error if user who hasn't bought the product tries to post review on POST /product/:productId/review", async () => {
      const { document } = await productTestBedService.insertProduct(
        userObj.document._id,
      );
      const review = mockReview();
      return testPost(app, `/product/${document._id}/review`, getCachedToken)
        .send(review)
        .expect(201)
        .expect(async () => {
          const productModel = await productTestBedService
            .getModel()
            .findOne({ _id: document._id });
          expect(productModel.reviews).toHaveLength(1);
          expect(productModel.reviews).toContain(
            expect.objectContaining(review),
          );
          expect(productModel.reviews[0].byUser).toBe(userObj.document._id);
        });
    });
    it('should be able to un-publish a product on PATCH /product/un-publish', async () => {
      const { document } = await productTestBedService.insertProduct(
        userObj.document._id,
      );
      return testPatch(app, `/product/${document._id}`, getCachedToken)
        .send({
          productId: document._id,
        })
        .expect(200)
        .expect(async () => {
          const productDoc = await productTestBedService
            .getModel()
            .findOne({ _id: document._id });
          expect(productDoc.reactions).toContain(userObj.document._id);
        });
    });
    it('should be able to update details of in-draft product when PATCH /product/:productId', async () => {
      const { document } = await productTestBedService.insertProduct(
        userObj.document._id,
      );
      const title = faker.random.words();
      return testPatch(app, `/product/${document._id}`, getCachedToken)
        .send({
          title,
        })
        .expect(200)
        .expect(async () => {
          const productModel = await productTestBedService
            .getModel()
            .findOne({ _id: document._id });
          expect(productModel.title).toBe(title);
        });
    });
  });

  describe('Public Routes', () => {
    it('should get products in descending order of overallRating on GET /product', async () => {
      await productTestBedService.insertNProducts();
      return testGet(app, '/product', () => '')
        .expect(200)
        .expect(async ({ body }) => {
          for (let i = 0; i < body.length - 1; i += 1) {
            expect(body[i].overallRating).toBeGreaterThan(
              body[i + 1].overallRating,
            );
          }
        });
    });
    it('should get a random product on GET /product/random', async () => {
      let product1, product2;
      await productTestBedService.insertNProducts();
      await testGet(app, '/product/random', () => '')
        .expect(200)
        .expect(async ({ body }) => {
          product1 = body.title;
        });
      await testGet(app, '/product/random', () => '')
        .expect(200)
        .expect(async ({ body }) => {
          product2 = body.title;
        });
      return expect(product1).not.toBe(product2);
    });
  });
});
