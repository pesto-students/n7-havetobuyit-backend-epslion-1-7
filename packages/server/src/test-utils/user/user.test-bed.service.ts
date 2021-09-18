import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../shared/config/constants';
import { UserRepository } from '../../db/services/user.repository';
import { mockUser } from './user';

@Injectable()
export class UserTestBedService {
  constructor(private readonly userRepository: UserRepository) {}
  getModel() {
    return this.userRepository;
  }

  async insertUser() {
    const user = mockUser();
    return {
      document: await this.userRepository.create({
        ...user,
        credentials: {
          ...user.credentials,
          password: await bcrypt.hash(user.credentials.password, SALT_ROUNDS),
        },
      }),
      user,
    };
  }
}
