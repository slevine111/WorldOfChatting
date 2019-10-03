import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest()
      let accessToken: string = ''
      const authHeader: string | undefined = request.header('Authorization')
      if (typeof authHeader === 'string') {
        accessToken = authHeader.split('Bearer ')[1]
      } else if (typeof request.cookies.accessToken === 'string') {
        accessToken = request.cookies.accessToken
      }
      if (accessToken === '') throw new Error()
      this.jwtService.verify(accessToken)
      return true
    } catch (error) {
      //return false
      throw new HttpException('Not authorized for route', HttpStatus.FORBIDDEN)
    }
  }
}
