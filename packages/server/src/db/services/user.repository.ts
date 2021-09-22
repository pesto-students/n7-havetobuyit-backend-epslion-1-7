import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../schemas/user/user.schema';
import { User } from '../../interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  getModel(): Model<UserModel> {
    return this.userModel;
  }
  async create(createUserDto: User): Promise<UserModel> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findOne(email: string): Promise<UserModel> {
    return this.userModel.findOne({ 'credentials.email': email }).exec();
  }

  async findOneWithRefs(
    email: string,
    refs: PopulateOptions | PopulateOptions[],
  ): Promise<UserModel> {
    return this.userModel
      .findOne({ 'credentials.email': email })
      .populate(refs);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async updateOne(
    email: string,
    updatedUserObject: Partial<User>,
  ): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ 'credentials.email': email }, updatedUserObject, {
        new: true,
      })
      .lean();
  }

  async removeOne(email: string) {
    return this.userModel
      .findOneAndRemove({ 'credentials.email': email })
      .lean();
  }
}
