import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

import {
  AccessTokenPayload,
  CreateAccountCredentials,
  CreateAccountSuccess,
  EmailVerificationTokenPayload,
  GoogleLoginPayload,
  LoginCredentials,
  LoginSuccess,
} from '../../interfaces/auth.interface';

import { UserRepository } from '../../db/services/user.repository';
import { User, UserRoles, UserStatus } from '../../interfaces/user.interface';

import { makeVError } from '../../shared/utils/error';
import {
  AuthenticationErrors,
  ClientDomainName,
  JWT_SECRET,
  ResetPasswordTokenExpirationTime,
  SALT_ROUNDS,
  MailOptions,
  REFRESH_JWT_SECRET,
  RefreshTokenExpirationTime,
  AccessTokenExpirationTime,
} from '../../shared/config/constants';
import { MailService } from '../mail/mail.service';
import { buildResetPasswordMail } from '../utils';
import { RevokedTokenRepository } from '../../db/services/revoked-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly revokedTokenRepository: RevokedTokenRepository,
  ) {}

  generateRefreshToken(
    payload: any,
    expiresIn: number | string = RefreshTokenExpirationTime,
  ) {
    return jwt.sign(payload, REFRESH_JWT_SECRET, {
      expiresIn,
    });
  }

  generateAccessToken(
    payload: any,
    expiresIn: number = AccessTokenExpirationTime,
  ) {
    return this.jwtService.sign(payload, {
      expiresIn: Math.floor(expiresIn),
    });
  }

  async validateRefreshToken(token: string) {
    if (!token) {
      throw makeVError(AuthenticationErrors.INVALID_REFRESH_TOKEN);
    }

    const isRevokedToken = await this.revokedTokenRepository.findByToken({
      token,
    });
    if (isRevokedToken) {
      throw makeVError(AuthenticationErrors.INVALID_REFRESH_TOKEN);
    }

    const decodedToken = this.decodeToken(token, REFRESH_JWT_SECRET);
    if (!decodedToken || !(decodedToken as JwtPayload).email) {
      throw makeVError(AuthenticationErrors.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findOne(
      (decodedToken as JwtPayload).email,
    );
    if (!user) {
      throw makeVError(AuthenticationErrors.INVALID_REFRESH_TOKEN);
    }

    return decodedToken as LoginSuccess;
  }

  revokeToken(token: string) {
    return this.revokedTokenRepository.create({ token });
  }

  async validateUser(
    loginUserData: LoginCredentials,
  ): Promise<LoginSuccess | never> {
    const user = await this.userRepository
      .getModel()
      .findOne(
        {
          'credentials.email': loginUserData.email,
          role: {
            $ne: UserRoles.Admin,
          },
        },
        {
          credentials: {
            password: 1,
            email: 1,
          },
          status: 1,
          profile: 1,
          role: 1,
          proMember: 1,
        },
      )
      .exec();

    if (!user) {
      throw makeVError(AuthenticationErrors.ACCOUNT_DOES_NOT_EXIST);
    }
    if (
      !user.credentials.password ||
      user.status !== UserStatus.Activated ||
      !(await bcrypt.compare(loginUserData.password, user.credentials.password))
    ) {
      throw makeVError(AuthenticationErrors.INVALID_PASSWORD);
    }

    return {
      id: user._id,
      email: user.credentials.email,
      role: user.role,
      accountHolderName: user.firstName,
    };
  }

  async loginUser(user: LoginSuccess) {
    /**
     * Note: we choose a property name of sub to hold our
     *  user.id value to be consistent with JWT standards */
    const payload: AccessTokenPayload = {
      email: user.email,
      sub: user.id,
      accountHolderName: user.accountHolderName,
      role: user.role,
    };
    return {
      access_token: this.generateAccessToken(
        payload,
        user.accessTokenExpiration,
      ),
      name: user.accountHolderName,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async googleLoginOrRegister(user: GoogleLoginPayload) {
    const existingUser = await this.userRepository
      .getModel()
      .findOne({ 'credentials.email': user.email })
      .exec();
  }

  async createUserFromRegistration(
    createUserPayload: CreateAccountCredentials,
  ): Promise<CreateAccountSuccess | never> {
    const existingUser = await this.userRepository.findOne(
      createUserPayload.email,
    );
    if (existingUser) {
      throw makeVError(AuthenticationErrors.ACCOUNT_EXIST);
    }
    const passwordHash = await bcrypt.hash(
      createUserPayload.password,
      SALT_ROUNDS,
    );
    const user: User = {
      status: UserStatus.Inactivated,
      addresses: [],
      orderedProducts: [],
      firstName: createUserPayload.firstName,
      lastName: createUserPayload.firstName,
      lastLogin: null,
      lifetimeValue: 0,
      userRegisteredAt: new Date(),
      credentials: {
        email: createUserPayload.email,
        password: passwordHash,
      },
      role: UserRoles.User,
    };

    const createdUser = await this.userRepository.create(user);
    return {
      userId: createdUser._id,
    };
  }

  decodeToken(token: string, secret = JWT_SECRET) {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      return false;
    }
  }

  async sendResetPasswordLink(emailId: string, isAdmin = false) {
    const existingUser = await this.userRepository.findOne(emailId);
    if (!existingUser) {
      return {
        ok: 1,
      };
    }
    const token = jwt.sign(
      {
        emailId,
      },
      JWT_SECRET,
      {
        expiresIn: ResetPasswordTokenExpirationTime,
      },
    );

    const url = ClientDomainName.concat(`reset-password/change/${token}`);
    this.mailService.sendMail({
      ...MailOptions,
      to: [
        {
          email: emailId,
          name: emailId,
          type: 'to',
        },
      ],
      subject: 'Reset Password Link',
      html: buildResetPasswordMail(url),
    });
    return {
      ok: 1,
    };
  }
  async validateResetPasswordToken(token: string) {
    const decodedToken = this.decodeToken(token);

    if (!decodedToken || !(decodedToken as any).emailId) {
      throw makeVError(AuthenticationErrors.INVALID_PASSWORD_RESET_TOKEN);
    }
    const isRevokedToken = await this.revokedTokenRepository.findByToken({
      token,
    });
    if (isRevokedToken) {
      throw makeVError(AuthenticationErrors.INVALID_PASSWORD_RESET_TOKEN);
    }
    return { ok: 1 };
  }

  async resetPassword(token: string, newPassword: string) {
    const decodedToken = this.decodeToken(token);

    if (!decodedToken || !(decodedToken as any).emailId) {
      throw makeVError(AuthenticationErrors.INVALID_PASSWORD_RESET_TOKEN);
    }
    const emailId = (decodedToken as any).emailId;
    return this._setPassword(emailId, newPassword);
  }

  private async _setPassword(emailId: string, newPassword: string) {
    const existingUser = await this.userRepository.findOne(emailId);
    if (!existingUser) {
      throw makeVError(AuthenticationErrors.ACCOUNT_DOES_NOT_EXIST);
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    existingUser.credentials.password = passwordHash;

    existingUser.status = UserStatus.Activated;
    existingUser.markModified('credentials');
    await existingUser.save();

    return { ok: 1 };
  }

  async validateEmailVerificationToken(token: string) {
    const isRevokedToken = await this.revokedTokenRepository.findByToken({
      token,
    });
    if (isRevokedToken)
      throw makeVError(AuthenticationErrors.INVALID_EMAIL_VERIFICATION_TOKEN);

    const decodedToken = this.decodeToken(
      token,
    ) as EmailVerificationTokenPayload;
    if (!decodedToken || !decodedToken.emailId || !decodedToken.userId)
      throw makeVError(AuthenticationErrors.INVALID_EMAIL_VERIFICATION_TOKEN);

    return decodedToken;
  }

  async isEmailAvailable(requestedEmail: string) {
    return true;
  }
}
