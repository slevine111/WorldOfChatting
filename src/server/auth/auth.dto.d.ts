import { User } from '../../entities'

export interface IUserSignInDTO {
  email: string
  password: string
}

export interface IGetTokenResult {
  accessToken: string
}

export interface ITokenAndUser extends IGetTokenResult {
  user: User
}

export interface IAccessTokenClaims {
  sub: string
  iat: number
  exp: number
  jti: string
}
