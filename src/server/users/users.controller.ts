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

@Controller('/api/user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get('/specified/:userIds')
  @UseGuards(AuthGuard)
  getSpecifiedUsers(@Param('userIds') userIds: string): Promise<User[]> {
    return this.userService.getSpecifiedUsers(userIds)
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
