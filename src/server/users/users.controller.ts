import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query
} from '@nestjs/common'
import UserService from './users.service'
import AuthGuard from '../auth/auth.guard'
import { User } from '../../entities'
import { IUserPostDTO, IUserUpdateDTO } from './users.dto'

@Controller('/api/user')
@UseGuards(AuthGuard)
export default class UserController {
  constructor(private userService: UserService) {}

  @Get()
  index(): Promise<User[]> {
    return this.userService.getAll()
  }

  @Get('/loggedin')
  getLoggedInSpecifiedUsers(
    @Query('userIds') userIds: string
  ): Promise<User[]> {
    return this.userService.getLoggedInSpecifiedUsers(userIds)
  }

  @Post()
  addNewUser(@Body() user: IUserPostDTO): Promise<User> {
    return this.userService.addNewUser(user)
  }

  @Put('/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updatedUser: IUserUpdateDTO
  ): Promise<User | undefined> {
    return this.userService.updateUser(userId, updatedUser)
  }
}
