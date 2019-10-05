import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Res,
  Req,
  Inject,
  UseGuards,
  CACHE_MANAGER,
  HttpStatus
} from '@nestjs/common'
import { Response, Request } from 'express'
import AuthService from './auth.service'
import AuthGuard from './auth.guard'
import {
  IUSerSignInDTO,
  IGetTokenResult,
  ITokenAndUser,
  IAccessTokenClaims
} from './auth.dto'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants'
import { Cache } from 'cache-manager'

@Controller('/api/auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  @Post('/getToken')
  getToken(@Body() userSignIn: IUSerSignInDTO): Promise<IGetTokenResult> {
    return this.authService.getToken(userSignIn.email, userSignIn.password)
  }

  @Post('/login')
  storeTokenAndReturnUser(
    @Body() userSignIn: IUSerSignInDTO,
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
    const accessToken: string | undefined = req.cookies.accessToken
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
    this.cacheManager.set(
      accessTokenClaims.jti,
      'revoke',
      (accessTokenClaims.exp - Date.now() * 1000) / 1000
    )
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
    res.sendStatus(HttpStatus.NO_CONTENT)
  }
}
