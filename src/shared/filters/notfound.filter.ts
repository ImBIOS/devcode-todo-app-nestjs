import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
// import { Response } from 'express';
import { FastifyReply } from 'fastify';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // const response = ctx.getResponse<Response>();
    const response: FastifyReply<any> = ctx.getResponse<FastifyReply>();

    const status = exception.getStatus();
    const message: any = exception.getResponse();

    response
      .status(status)
      // you can manipulate the response here
      .send({
        statusCode: status,
        status: 'Not Found',
        message: message.message,
      });
  }
}
