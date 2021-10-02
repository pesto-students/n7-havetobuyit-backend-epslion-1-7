import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule, INestApplication } from '@nestjs/common';
import path from 'path';
import { Mandrill } from 'mandrill-api';
import { config } from 'dotenv';
import request from 'supertest';
import { StripeModule } from 'nestjs-stripe';
import faker from 'faker';
import { JwtModule } from '@nestjs/jwt';
import mongoose from 'mongoose';
import {
  DB_URL,
  JWT_SECRET,
  MandrillTestApiKey,
  StripeProductionSecretKey,
} from '../shared/config/constants';
import { TestingModule, Test } from '@nestjs/testing';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../shared/auth/auth.service';
import { MailService } from '../shared/mail/mail.service';
import { JwtStrategy } from '../shared/strategies/jwt.strategy';
import { UserTestBedService } from './user/user.test-bed.service';
import { DatabaseModule } from '../db/database.module';
import { TRANSPORTER } from '../shared/mail/constants';
import { AuthController } from '../auth/controller/auth.controller';
import { UserService } from '../user/service/user.service';
import { transportFactory } from '../shared/mail/transport.factory';
import { ProductService } from '../shared/product/product.service';

export const provideMongoDb = () => {
  return [MongooseModule.forRoot(DB_URL)];
};

export const generateRandomUid = () => mongoose.Types.ObjectId;

export const cleanupDB = async mongooseRef => {
  for (const URL of [DB_URL]) {
    await mongooseRef.connect(URL);
    await mongooseRef.connection.db.dropDatabase();
    await mongooseRef.disconnect();
  }
};
export const buildMockTransportFactory = async () => {
  const transport = new Mandrill(MandrillTestApiKey);
  const spy = jest.spyOn(transport.messages, 'send');
  return {
    transporter: {
      provide: TRANSPORTER,
      useFactory: () => {
        return transport;
      },
    },
    spy,
  };
};
export const makeTestModule = async (controllers: any[], services: any[]) => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      JwtStrategy,
      AuthService,
      UserTestBedService,
      transportFactory,
      MailService,
      UserService,
      ProductService,
      ...services,
    ],
    controllers: [AuthController, ...controllers],
    imports: [
      ...provideMongoDb(),
      DatabaseModule,
      AuthModule,
      JwtModule.register({
        secret: JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
      StripeModule.forRoot({
        apiKey: StripeProductionSecretKey,
        apiVersion: '2020-08-27',
      }),
    ],
  }).compile();
  return moduleRef.createNestApplication();
};

export const testGet = (
  app: INestApplication,
  url: string,
  tokenGetterFn?: () => string,
  type: 'json' | 'form' = 'json',
) => {
  if (!tokenGetterFn) {
    return request(app.getHttpServer())
      .get(url)
      .type(type);
  }
  return request(app.getHttpServer())
    .get(url)
    .set('Authorization', `Bearer ${tokenGetterFn()}`)
    .type(type);
};
export const testPost = (
  app: INestApplication,
  url: string,
  tokenGetterFn: () => string,
  type: 'json' | 'form' | any = 'form',
) => {
  return request(app.getHttpServer())
    .post(url)
    .set('Authorization', `Bearer ${tokenGetterFn()}`)
    .type(type);
};
export const testPatch = (
  app: INestApplication,
  url: string,
  tokenGetterFn: () => string,
  type: 'json' | 'form' = 'form',
) => {
  return request(app.getHttpServer())
    .patch(url)
    .set('Authorization', `Bearer ${tokenGetterFn()}`)
    .type(type);
};
export const testDelete = (
  app: INestApplication,
  url: string,
  tokenGetterFn: () => string,
  type: 'json' | 'form' = 'json',
) => {
  return request(app.getHttpServer())
    .delete(url)
    .set('Authorization', `Bearer ${tokenGetterFn()}`)
    .type(type);
};

export const getRandomText = (count = 3) => faker.random.words(count);
