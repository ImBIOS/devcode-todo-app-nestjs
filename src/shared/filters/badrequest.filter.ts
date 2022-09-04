import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
// import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
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
        status: 'Bad Request',
        message: message.message[0].replace(
          'should not be empty',
          'cannot be null',
        ),
      });
  }
}
