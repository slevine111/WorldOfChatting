import { Controller, Get, Post, Body } from '@nestjs/common'
import UserService from './users.service'
import { User } from '../../entities'
import { IUserPostDTO } from './users.dto'

@Controller('/api/user')
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
