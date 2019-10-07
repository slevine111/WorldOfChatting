import {
  Injectable,
  HttpException,
  Inject,
  CACHE_MANAGER
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import UserService from '../users/users.service'
import { User } from '../../entities'
import { IGetTokenResult, ITokenAndUser, IAccessTokenClaims } from './auth.dto'
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
      { expiresIn: '1hr', jwtid: `${Date.now()}${user.id}` }
    )
  }

  getToken(email: string, password: string): Promise<IGetTokenResult> {
    return this.userService.findSingleUser(email, password).then(
      (user: User): IGetTokenResult => ({
        accessToken: this.createToken(user)
      })
    )
  }

  getTokenAndUser(email: string, password: string): Promise<ITokenAndUser> {
    return this.userService.findSingleUser(email, password).then(
      (user: User): ITokenAndUser => ({
        accessToken: this.createToken(user),
        user
      })
    )
  }

  createAndThrow401Error(): void {
    throw new HttpException('authorization token invalid', 401)
  }

  exchangeTokenForUser(accessToken: string): Promise<ITokenAndUser> {
    return this.jwtService
      .verifyAsync(accessToken, { ignoreExpiration: true })
      .catch(() => {
        this.createAndThrow401Error()
      })
      .then(async (accessTokenClaims: IAccessTokenClaims) => {
        if (typeof accessTokenClaims.exp !== 'number') {
          this.createAndThrow401Error()
        }
        if (Date.now() / 1000 > accessTokenClaims.exp + 2 * 24 * 3600) {
          this.createAndThrow401Error()
        }
        let user: User | undefined = await this.userService.findSingleUserById(
          accessTokenClaims.sub
        )
        if (user === undefined) {
          this.createAndThrow401Error()
        }
        return {
          accessToken: this.createToken(user!),
          user: user!
        }
      })
  }

  addTokenToBlacklist(accessTokenClaims: IAccessTokenClaims): void {
    this.cacheManager.set(accessTokenClaims.jti, 'revoke', {
      ttl: Math.ceil(accessTokenClaims.exp - Date.now() / 1000)
    })
  }
}
