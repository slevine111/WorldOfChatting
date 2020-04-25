import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common'
import UserService from './users.service'
import AuthGuard from '../auth/auth.guard'
import { User } from '../../entities'
import { IUserPostDTO } from './users.dto'
import { IReduxStoreUserFields } from '../../types-for-both-server-and-client'

@Controller('/api/user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get('/:userId/linkedto')
  @UseGuards(AuthGuard)
  getUsersLinked(
    @Param('userId') userId: string
  ): Promise<IReduxStoreUserFields[]> {
    return this.userService.getUsersLinked(userId)
  }

  @Post()
  addNewUser(@Body() user: IUserPostDTO): Promise<User> {
    return this.userService.addNewUser(user)
  }

  @Put('/:userId')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('userId') userId: string,
    @Body() updatedUser: Partial<User>
  ): Promise<User | undefined> {
    return this.userService.updateUser(userId, updatedUser)
  }
}
