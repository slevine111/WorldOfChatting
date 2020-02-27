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
import { FastifyReply, FastifyRequest } from 'fastify'
import AuthService from './auth.service'
import AuthGuard from './auth.guard'
import {
  IUserSignInDTO,
  IGetTokenResult,
  ITokenAndRelatedInfo,
  ITokenAndUser
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
    @Res() res: FastifyReply<ITokenAndUser>
  ): Promise<void> {
    return this.authService
      .loginUserAndCreateToken(userSignIn.email, userSignIn.password)
      .then(({ accessToken, user, expireTime }: ITokenAndRelatedInfo) => {
        res
          .setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true })
          .send({ user, expireTime })
      })
  }

  @Get('')
  getloggedInUser(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<ITokenAndUser>
  ): Promise<void> {
    const accessToken: string | undefined =
      req.cookies[ACCESS_TOKEN_COOKIE_NAME]
    if (accessToken === undefined) {
      this.authService.createAndThrow401Error()
    }
    return this.authService
      .exchangeTokenForUser(accessToken!, true)
      .then(({ accessToken, user, expireTime }: ITokenAndRelatedInfo) => {
        res
          .setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true })
          .send({ user, expireTime })
      })
  }

  @Delete('')
  @UseGuards(AuthGuard)
  logoutUser(@Req() req: FastifyRequest, @Res() res: FastifyReply<null>): void {
    this.authService.addTokenToBlacklist(req.cookies[ACCESS_TOKEN_COOKIE_NAME])
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME).status(HttpStatus.NO_CONTENT)
  }

  @Get('/refreshToken')
  refreshToken(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<number>
  ): Promise<void> {
    return this.authService
      .exchangeTokenForUser(req.cookies[ACCESS_TOKEN_COOKIE_NAME], false)
      .then(({ accessToken, expireTime }: ITokenAndRelatedInfo) => {
        res
          .setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true })
          .send(expireTime)
      })
  }
}
