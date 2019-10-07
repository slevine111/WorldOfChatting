import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Res,
  Req,
  UseGuards,
  HttpStatus
} from '@nestjs/common'
import { Response, Request } from 'express'
import AuthService from './auth.service'
import AuthGuard from './auth.guard'
import {
  IUserSignInDTO,
  IGetTokenResult,
  ITokenAndUser,
  IAccessTokenClaims
} from './auth.dto'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants'

@Controller('/api/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/getToken')
  getToken(@Body() userSignIn: IUserSignInDTO): Promise<IGetTokenResult> {
    return this.authService.getToken(userSignIn.email, userSignIn.password)
  }

  @Post('/login')
  storeTokenAndReturnUser(
    @Body() userSignIn: IUserSignInDTO,
    @Res() res: Response
  ): Promise<void> {
    return this.authService
      .getTokenAndUser(userSignIn.email, userSignIn.password)
      .then(({ accessToken, user }: ITokenAndUser) => {
        res
          .cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true })
          .json(user)
      })
  }

  @Get('')
  getloggedInUser(@Req() req: Request, @Res() res: Response): Promise<void> {
    const accessToken: string | undefined =
      req.cookies[ACCESS_TOKEN_COOKIE_NAME]
    if (accessToken === undefined) {
      this.authService.createAndThrow401Error()
    }
    return this.authService
      .exchangeTokenForUser(accessToken!)
      .then(({ accessToken, user }: ITokenAndUser) => {
        res
          .cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true })
          .json(user)
      })
  }

  @Delete('')
  @UseGuards(AuthGuard)
  logoutUser(@Req() req: Request, @Res() res: Response): void {
    const accessTokenClaims: IAccessTokenClaims = this.authService.decodeToken(
      req.cookies[ACCESS_TOKEN_COOKIE_NAME]
    )
    this.authService.addTokenToBlacklist(accessTokenClaims)
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
    res.sendStatus(HttpStatus.NO_CONTENT)
  }
}
