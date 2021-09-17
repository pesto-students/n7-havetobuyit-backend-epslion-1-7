import {
  Body,
  Controller,
  Post,
  Get,
  UseFilters,
  UsePipes,
  UseGuards,
  Req,
  Param,
  Res,
} from '@nestjs/common';
import ms from 'ms';
import { CreateAccountCredentials } from '../../interfaces/auth.interface';
import { JoiValidationPipe } from '../../shared/pipes/validation.pipe';
import { AuthService } from '../../shared/auth/auth.service';
import { HttpExceptionFilter } from '../../shared/filters/http-exception.filter';
import {
  createAccountSchema,
  loginSchema,
  paramEmailSchema,
  resetPasswordEmailSchema,
  resetPasswordSchema,
  tokenSchema,
} from './validation-schemas';
import { LocalAuthGuard } from '../../shared/auth/auth.guard';
import { Request, Response } from 'express';
import {
  UserRefreshTokenCookieName,
  RefreshTokenExpirationTime,
} from '../../shared/config/constants';
import { GoogleAuthGuard } from '../../shared/auth/google.guard';

@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new JoiValidationPipe(createAccountSchema))
  async register(@Body() createUserDto: CreateAccountCredentials) {
    return this.authService.createUserFromRegistration(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(@Req() request, @Res() response: Response) {
    response.cookie(
      UserRefreshTokenCookieName,
      this.authService.generateRefreshToken(
        request.user,
        RefreshTokenExpirationTime,
      ),
      {
        httpOnly: true,
        maxAge: Math.floor(ms(RefreshTokenExpirationTime)),
      },
    );
    const loginResponse = await this.authService.loginUser(request.user);

    response.send({ ...loginResponse });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(@Req() req) {
    console.log(req.body);
    return { ok: 1 };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    console.log(req.user);
    return { ok: 1 };
  }

  @Get('access-token')
  async getAccessToken(@Req() request: Request) {
    if (request.cookies[UserRefreshTokenCookieName]) {
      const decodedToken = await this.authService.validateRefreshToken(
        request.cookies[UserRefreshTokenCookieName],
      );
      if (decodedToken) {
        return this.authService.loginUser(decodedToken);
      }
    }
    return { ok: 0 };
  }

  @Get('logout')
  logout(@Req() request: Request, @Res() res: Response) {
    if (
      request.cookies[UserRefreshTokenCookieName] &&
      request.cookies[UserRefreshTokenCookieName] !== ''
    ) {
      this.authService.revokeToken(request.cookies[UserRefreshTokenCookieName]);
      res.cookie(UserRefreshTokenCookieName, '', {
        maxAge: Date.now() - 100000,
      });
    }
    res.send({ ok: 1 });
  }

  @Post('reset-password')
  async getResetPasswordLink(
    @Body(new JoiValidationPipe(resetPasswordEmailSchema))
    body: {
      email: string;
    },
  ) {
    return this.authService.sendResetPasswordLink(body.email);
  }

  @Get('/reset-password/:token/verify')
  async verifyResetPasswordToken(
    @Param('token', new JoiValidationPipe(tokenSchema))
    token: string,
  ) {
    return this.authService.validateResetPasswordToken(token);
  }

  @Post('/reset-password/:token')
  async resetPassword(
    @Param('token', new JoiValidationPipe(tokenSchema))
    token: string,
    @Body(new JoiValidationPipe(resetPasswordSchema))
    { password }: { password: string },
  ) {
    this.authService.revokeToken(token);
    return this.authService.resetPassword(token, password);
  }

  @Post('/email-available')
  async isEmailAvailable(
    @Body('requestedEmail', new JoiValidationPipe(paramEmailSchema))
    requestedEmail: string,
  ) {
    if (await this.authService.isEmailAvailable(requestedEmail))
      return { ok: 0 };
  }
}
