import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'

config()

@Injectable()
export default class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest()
      const accessToken: string =
        (request.header('Authorization') as string).split('Bearer ')[1] ||
        request.cookies.accessToken
      jwt.verify(accessToken, process.env.JWT_SECRET as string)
      return true
    } catch (error) {
      return false
    }
  }
}
