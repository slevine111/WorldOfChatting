import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import UserService from './users.service'
import AuthGuard from '../auth/auth.guard'
import { User } from '../../entities'
import { IUserPostDTO } from './users.dto'

@Controller('/api/user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get('/loggedin')
  @UseGuards(AuthGuard)
  getLoggedInSpecifiedUsers(
    @Query('userIds') userIds: string
  ): Promise<User[]> {
    if (userIds === '') {
      throw new HttpException(
        'userIds value in query string can NOT be empty',
        HttpStatus.BAD_REQUEST
      )
    }
    return this.userService.getLoggedInSpecifiedUsers(userIds)
  }

  @Post()
  addNewUser(@Body() user: IUserPostDTO): Promise<User> {
    return this.userService.addNewUser(user)
  }
}
