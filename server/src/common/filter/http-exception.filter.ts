import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResultData } from '../utils/result';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();

    if (status !== 200) {
      if (Array.isArray((exception.getResponse() as any).message)) {
        response.status(200).json(
          ResultData.fail(
            status,
            (exception.getResponse() as any).message?.join(','),
          ),
        );
        return;
      }
      response.status(status).json(
        ResultData.fail(
          status,
          (exception.getResponse() as any).message || exception.getResponse(),
        ),
      );
    }
  }
}
