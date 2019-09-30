import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import UserService from '../users/users.service'
import { User } from '../../entities'
import { IGetTokenResult, ITokenAndUser } from './auth.dto'

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  getToken(email: string, password: string): Promise<IGetTokenResult> {
    return this.userService.findSingleUser(email, password).then(
      (user: User): IGetTokenResult => ({
        accessToken: this.jwtService.sign(
          { sub: user.id },
          { expiresIn: '1sec' }
        )
      })
    )
  }

  getTokenAndUser(email: string, password: string): Promise<ITokenAndUser> {
    return this.userService.findSingleUser(email, password).then(
      (user: User): ITokenAndUser => ({
        accessToken: this.jwtService.sign({ sub: user.id }),
        user
      })
    )
  }
}
