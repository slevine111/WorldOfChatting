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
import { IUserPostDTO, IUserUpdateDTO } from './users.dto'
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

  /* @Get('/:userId/notifications/received')
  @UseGuards(AuthGuard)
  getUsersLinkedToNotification(
    @Param('userId') userId: string
  ): Promise<IReduxStoreUserFields[]> {
    return this.userService.getUsersLinked(
      userId,
      EntityGetUsersLinkedTo.NOTIFICATION
    )
  }

  @Get('/linked/language/:language')
  @UseGuards(AuthGuard)
  getUsersLinkedToLanguage(
    @Param('language') language: string
  ): Promise<IReduxStoreUserFields[]> {
    return this.userService.getUsersLinked(
      language,
      EntityGetUsersLinkedTo.USER_LANGUAGE
    )
  }*/

  @Post()
  addNewUser(@Body() user: IUserPostDTO): Promise<User> {
    return this.userService.addNewUser(user)
  }

  @Put('/:userId')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('userId') userId: string,
    @Body() updatedUser: IUserUpdateDTO
  ): Promise<User | undefined> {
    return this.userService.updateUser(userId, updatedUser)
  }
}
