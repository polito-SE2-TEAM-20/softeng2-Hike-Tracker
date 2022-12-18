import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!process.env.DISABLE_EXCEPTION_LOG) {
      console.log('got exception', exception);
    }

    if (exception instanceof BadRequestException) {
      let finalMessage = '';

      const res: any = exception.getResponse();
      if (res.message?.length) {
        finalMessage = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message;
      }

      return response.status(status).json({
        message: finalMessage ?? 'Uknown error',
        statusCode: status,
      });
    }

    response.status(status).json({
      message:
        exception instanceof HttpException
          ? exception.message
          : typeof exception === 'object'
          ? (exception as Error).message
          : 'Uknown error',
      statusCode: status,
    });
  }
}
