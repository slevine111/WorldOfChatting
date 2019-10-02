import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common'
import { Response, Request } from 'express'
import AuthService from './auth.service'
import { IUSerSignInDTO, IGetTokenResult, ITokenAndUser } from './auth.dto'

@Controller('/api/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        res.cookie('accessToken', accessToken, { httpOnly: true }).json(user)
      })
  }

  @Get('')
  getloggedInUser(@Req() req: Request, @Res() res: Response): Promise<void> {
    const accessToken: string | undefined = req.cookies.accessToken
    if (accessToken === undefined) {
      this.authService.createAndThrow401Error()
    }
    return this.authService
      .exchangeTokenForUser(<string>accessToken)
      .then(({ accessToken, user }: ITokenAndUser) => {
        res.cookie('accessToken', accessToken, { httpOnly: true }).json(user)
      })
  }
}
