import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../../interfaces/product.interface';
import { ProductModel } from '../schemas/product/product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(ProductModel.name) private productModel: Model<ProductModel>,
  ) {}

  getModel(): Model<ProductModel> {
    return this.productModel;
  }
  async create(createProductDto: Product): Promise<ProductModel> {
    const createdUser = new this.productModel(createProductDto);
    return createdUser.save();
  }

  findOne(filter: FilterQuery<ProductModel>): Promise<ProductModel> {
    return this.productModel.findOne(filter).exec();
  }
  async findAll(): Promise<Product[]> {
    return this.productModel.find().lean();
  }

  async updateOne(
    filter: FilterQuery<ProductModel>,
    updateProductObject: Product,
  ): Promise<Product> {
    return this.productModel
      .findOneAndUpdate(filter, updateProductObject, {
        new: true,
      })
      .lean();
  }

  async removeOne(filter: FilterQuery<ProductModel>) {
    return this.productModel.deleteOne(filter).lean();
  }
}
