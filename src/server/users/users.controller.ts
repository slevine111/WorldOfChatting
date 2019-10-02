import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import UserService from './users.service'
import AuthGuard from '../auth/auth.guard'
import { User } from '../../entities'
import { IUserPostDTO } from './users.dto'

@Controller('/api/user')
@UseGuards(AuthGuard)
export default class UserController {
  constructor(private userService: UserService) {}

  @Get()
  index(): Promise<User[]> {
    return this.userService.getAll()
  }

  @Get('/loggedin')
  findLoggedInUsers(): Promise<User[]> {
    return this.userService.findLoggedInUsers()
  }

  @Post()
  addNewUser(@Body() user: IUserPostDTO): Promise<User> {
    return this.userService.addNewUser(user)
  }
}
