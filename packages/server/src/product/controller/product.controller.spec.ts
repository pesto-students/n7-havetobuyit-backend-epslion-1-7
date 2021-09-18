import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create an in-draft product on POST /product/new');
  it(
    'should be able to change status to in-review when in-draft product is submitted for review on POST /product/request-publish',
  );
  it(
    'should be able to add a reaction to a product on PATCH /product/:productId',
  );
  it(
    'should throw 401 when unauthenticated user tries adding a reaction on PATCH /product/:productId',
  );
  it(
    'should be able to add review to a product on POST /product/:productId/review',
  );
  it(
    "should throw 400 error if user who hasn't bought the product tries to post review on POST /product/:productId/review",
  );
  it('should be able to un-publish a product on PATCH /product/un-publish');
  it(
    'should get products in descending order of overallRating on GET /product',
  );
  it('should get a random product on GET /product/random');
  it(
    'should be able to update details of in-draft product when PATCH /product/:productId',
  );
});
