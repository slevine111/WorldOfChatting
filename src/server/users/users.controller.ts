import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param
} from '@nestjs/common'
import UserService from './users.service'
import AuthGuard from '../auth/auth.guard'
import { User } from '../../entities'
import { IUserPostDTO, IUserUpdateDTO } from './users.dto'
import { IUserAndChatGroupGetReturn } from '../../shared-types'

@Controller('/api/user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get('/linked/:userId/withchatgroup')
  @UseGuards(AuthGuard)
  getUsersAndTheirChatGroups(
    @Param('userId') userId: string
  ): Promise<IUserAndChatGroupGetReturn[]> {
    return this.userService.getUsersAndTheirChatGroups(userId)
  }

  @Get('/linked/language/:language')
  @UseGuards(AuthGuard)
  getUsersLinkedToLanguage(
    @Param('language') language: string
  ): Promise<User[]> {
    return this.userService.getUsersLinkedToLanguage(language)
  }

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
