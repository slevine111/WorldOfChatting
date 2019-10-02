import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export default class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response: Response = context.getResponse<Response>()
    console.dir(exception)
    console.log(exception instanceof HttpException)
    response.status(exception.getStatus()).json(exception.getResponse())
  }
}
