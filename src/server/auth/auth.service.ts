import {
  Injectable,
  HttpException,
  Inject,
  CACHE_MANAGER
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import UserService from '../users/users.service'
import { User } from '../../entities'
import {
  IGetTokenResult,
  ITokenAndRelatedInfo,
  IAccessTokenClaims
} from './auth.dto'
import { Cache } from 'cache-manager'

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  decodeToken(accessToken: string): IAccessTokenClaims {
    return <IAccessTokenClaims>this.jwtService.decode(accessToken)
  }

  createToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '3h', jwtid: `${Date.now()}${user.id}` }
    )
  }

  getToken(email: string, password: string): Promise<IGetTokenResult> {
    return this.userService.findSingleUser(email, password).then(
      (user: User): IGetTokenResult => ({
        accessToken: this.createToken(user)
      })
    )
  }

  getTokenAndUser(
    email: string,
    password: string
  ): Promise<ITokenAndRelatedInfo> {
    return this.userService
      .findSingleUser(email, password)
      .then(
        (user: User): Promise<User> => {
          return <Promise<User>>(
            this.userService.updateUser(user.id, { loggedIn: true })
          )
        }
      )
      .then(
        (user: User): ITokenAndRelatedInfo => {
          const accessToken: string = this.createToken(user)
          const expireTime: number = this.decodeToken(accessToken).exp
          return {
            accessToken,
            user,
            expireTime
          }
        }
      )
  }

  createAndThrow401Error(): void {
    throw new HttpException('authorization token invalid', 401)
  }

  exchangeTokenForUser(
    accessToken: string,
    checkExpireTime: boolean
  ): Promise<ITokenAndRelatedInfo> {
    return this.jwtService
      .verifyAsync(accessToken, { ignoreExpiration: true })
      .catch(() => {
        this.createAndThrow401Error()
      })
      .then(async (accessTokenClaims: IAccessTokenClaims) => {
        if (checkExpireTime) {
          if (typeof accessTokenClaims.exp !== 'number') {
            this.createAndThrow401Error()
          }
          if (Date.now() / 1000 > accessTokenClaims.exp + 2 * 24 * 3600) {
            this.createAndThrow401Error()
          }
        }
        let user: User | undefined = await this.userService.findSingleUserById(
          accessTokenClaims.sub
        )
        if (user === undefined) {
          this.createAndThrow401Error()
        }
        const accessToken: string = this.createToken(user!)
        const expireTime: number = this.decodeToken(accessToken).exp
        return {
          accessToken,
          user: user!,
          expireTime
        }
      })
  }

  addTokenToBlacklist(accessToken: string): void {
    const accessTokenClaims: IAccessTokenClaims = this.decodeToken(accessToken)
    this.cacheManager.set(accessTokenClaims.jti, 'revoke', {
      ttl: Math.ceil(accessTokenClaims.exp - Date.now() / 1000)
    })
  }
}
