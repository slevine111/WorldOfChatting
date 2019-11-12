import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
  CACHE_MANAGER,
  Inject
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants'
import { IAccessTokenClaims } from './auth.dto'
import { Cache } from 'cache-manager'

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return new Promise((res, rej) => {
      const request: Request = context.switchToHttp().getRequest()
      let accessToken: string = ''
      const authHeader: string | undefined = request.header('Authorization')
      if (typeof authHeader === 'string') {
        accessToken = authHeader.split('Bearer ')[1]
      } else if (
        typeof request.cookies[ACCESS_TOKEN_COOKIE_NAME] === 'string'
      ) {
        accessToken = request.cookies[ACCESS_TOKEN_COOKIE_NAME]
      }
      if (accessToken === '') rej('not authorized')
      const { jti }: IAccessTokenClaims = this.jwtService.verify(accessToken)
      return this.cacheManager.get(jti).then(jtiBacklisted => {
        if (jtiBacklisted) rej('not authorized')
        res(true)
      })
    })
      .then(() => true)
      .catch(() => {
        throw new HttpException(
          'Not authorized for route',
          HttpStatus.FORBIDDEN
        )
      })
  }
}
