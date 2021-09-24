import { Injectable } from '@nestjs/common';
import {
  ProductErrors,
  ReactionsMapping,
  ReactionWeight,
  ReviewWeight,
} from '../../shared/config/constants';
import { makeVError } from '../../shared/utils/error';
import { ProductRepository } from '../../db/services/product.repository';
import {
  AvailableReactions,
  Product,
  ProductStatus,
  Review,
} from '../../interfaces/product.interface';
import { User } from '../../interfaces/user.interface';
import { UserRepository } from '../../db/services/user.repository';
import { ProductModel } from '../../db/schemas/product/product.schema';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getRandom() {
    return this.productRepository
      .getModel()
      .aggregate([{ $sample: { size: 1 } }])
      .exec();
  }

  async getProducts(querySkip: number, queryLimit: number) {
    const skip = querySkip;
    const limit = queryLimit;

    const links = {
      totalPages: Math.ceil(
        (await this.productRepository
          .getModel()
          .countDocuments()
          .exec()) / limit,
      ),
      currentPage: skip,
    };

    const data = await this.productRepository
      .getModel()
      .find()
      .sort('overallRating')
      .skip(skip * limit)
      .limit(limit)
      .exec();

    return {
      data,
      links,
    };
  }

  async create(product: Product) {
    return this.productRepository.create({
      ...product,
      overallRating: 0,
      status: ProductStatus.Draft,
    });
  }

  async publishProduct(productId: string, userId: string) {
    const product = await this.productRepository
      .getModel()
      .findById(productId)
      .exec();
    if (!product) {
      throw makeVError(ProductErrors.NOT_EXIST);
    }
    if (product.postedBy.toString() !== userId) {
      throw makeVError(ProductErrors.INVALID_PRODUCT_FOR_PUBLISH);
    }

    // Check for atleast one image before submitting for review
    if (!product.images.length) {
      throw makeVError(ProductErrors.NO_IMAGES_ADDED_TO_PRODUCT);
    }

    product.status = ProductStatus.InReview;
    return product.save();
  }

  async addReaction(
    userId: string,
    productId: string,
    reaction: AvailableReactions,
  ) {
    const product = await this.productRepository.findOne({ id: productId });
    if (!product) {
      throw makeVError(ProductErrors.NOT_EXIST);
    }

    product.reactions.push({
      reaction,
      user: (userId as unknown) as User,
    });

    product.overallRating += ReactionsMapping[reaction] * ReactionWeight;

    return product.save();
  }

  async addReview(
    userId: string,
    productId: string,
    review: Omit<Review, 'byUser'>,
  ) {
    const product = await this.productRepository.findOne({ _id: productId });
    if (!product) {
      throw makeVError(ProductErrors.NOT_EXIST);
    }

    const { orderedProducts } = await this.userRepository
      .getModel()
      .findById(userId)
      .populate('orderedProducts')
      .exec();
    if (
      !(orderedProducts as ProductModel[]).find(
        orderedProduct => orderedProduct._id.toString() === productId,
      )
    ) {
      throw makeVError(ProductErrors.CANNOT_ADD_REVIEW_TO_PRODUCT);
    }
    product.reviews.push({
      byUser: (userId as unknown) as User,
      ...review,
    });
    product.overallRating += Math.floor(review.rating * ReviewWeight);
    return product.save();
  }

  async unPublish(userId: string, productId: string) {
    const product = await this.productRepository
      .getModel()
      .findById(productId)
      .exec();
    if (!product) {
      throw makeVError(ProductErrors.NOT_EXIST);
    }
    if (product.postedBy.toString() !== userId) {
      throw makeVError(ProductErrors.INVALID_PRODUCT_FOR_PUBLISH);
    }

    product.status = ProductStatus.Draft;
    return product.save();
  }

  async update(
    userId: string,
    productId: string,
    productUpdatePayload: Partial<Product>,
  ) {
    const product = await this.productRepository
      .getModel()
      .findById(productId)
      .exec();
    if (!product) {
      throw makeVError(ProductErrors.NOT_EXIST);
    }
    if (product.postedBy.toString() !== userId) {
      throw makeVError(ProductErrors.INVALID_PRODUCT_FOR_PUBLISH);
    }
    if (
      product.status === ProductStatus.InReview ||
      product.status === ProductStatus.Published
    ) {
      throw makeVError(ProductErrors.CANNOT_UPDATE_NON_DRAFT_PRODUCT);
    }
    return this.productRepository
      .getModel()
      .updateOne({ _id: productId }, productUpdatePayload)
      .exec();
  }
}
