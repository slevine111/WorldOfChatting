import { Injectable, HttpException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import UserService from '../users/users.service'
import { User } from '../../entities'
import { IGetTokenResult, ITokenAndUser, IAccessTokenClaims } from './auth.dto'

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  verifyToken(accessToken: string): IAccessTokenClaims {
    return this.jwtService.verify(accessToken)
  }

  createToken(user: User): string {
    return this.jwtService.sign({ sub: user.id }, { expiresIn: '1hr' })
  }

  getToken(email: string, password: string): Promise<IGetTokenResult> {
    return this.userService.findSingleUser(email, password).then(
      (user: User | undefined): IGetTokenResult => {
        if (user === undefined) {
          throw new HttpException('username and/or password invalid', 400)
        }
        return {
          accessToken: this.createToken(user!)
        }
      }
    )
  }

  getTokenAndUser(email: string, password: string): Promise<ITokenAndUser> {
    return this.userService.findSingleUser(email, password).then(
      (user: User | undefined): ITokenAndUser => {
        if (user === undefined) {
          throw new HttpException('username and/or password invalid', 400)
        }
        return {
          accessToken: this.createToken(user!),
          user: user!
        }
      }
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
        if (Date.now() / 1000 > accessTokenClaims.exp + 2 * 24 * 3600 * 1000) {
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
}
