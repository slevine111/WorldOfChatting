import { Controller, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'
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
}