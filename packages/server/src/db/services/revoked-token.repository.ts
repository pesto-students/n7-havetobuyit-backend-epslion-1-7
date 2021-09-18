import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RevokedTokenModel } from '../schemas/revoked-token.schema';
import { Token } from '../../interfaces/token.interface';

@Injectable()
export class RevokedTokenRepository {
  constructor(
    @InjectModel(RevokedTokenModel.name)
    private revokedTokenModel: Model<RevokedTokenModel>,
  ) {}

  getModel() {
    return this.revokedTokenModel;
  }

  findAll(): Promise<Token[]> {
    return this.revokedTokenModel.find().exec();
  }
  findByToken({ token }: Token): Promise<Token> {
    return this.revokedTokenModel.findOne({ token }).exec();
  }
  create(token: Token): Promise<Token> {
    const newToken = new this.revokedTokenModel(token);
    return newToken.save();
  }
}
