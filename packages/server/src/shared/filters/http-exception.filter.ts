import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import VError from 'verror';
import { HTTP_EXCEPTIONS_MAPPING } from '../../shared/config/constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: VError | HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorInfo: VError.Info = VError.info(exception);

    if (errorInfo && errorInfo.code) {
      const code = HTTP_EXCEPTIONS_MAPPING[errorInfo.code];

      response.status(code).json({
        statusCode: code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: (exception as any).response?.error || exception.message,
      });
      return;
    }

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let statusMessage;
    if (exception instanceof HttpException) {
      statusMessage = exception.message;
    } else {
      console.log(exception, request.method);
      statusMessage = 'Something went wrong while processing your request';
    }

    response.status(statusCode).json({
      statusCode: statusCode,
      message: statusMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
