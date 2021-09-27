import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../../interfaces/order.interface';
import { OrderModel } from '../schemas/order/order.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(OrderModel.name) private orderModel: Model<OrderModel>,
  ) {}

  getModel(): Model<OrderModel> {
    return this.orderModel;
  }
  async create(createOrderDto: Order): Promise<OrderModel> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  findOne(filter: FilterQuery<OrderModel>): Promise<OrderModel> {
    return this.orderModel.findOne(filter).exec();
  }
  async findAll(): Promise<Order[]> {
    return this.orderModel.find().lean();
  }
}
