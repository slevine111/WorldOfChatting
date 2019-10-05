import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export default class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response: Response = context.getResponse<Response>()

    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.name === 'QueryFailedError'
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR

    const { message } = exception
    const errorBody =
      typeof message === 'string'
        ? {
            statusCode: status,
            message: message !== '' ? message : 'internal server error'
          }
        : message
    response.status(status).json(errorBody)
  }
}
