import { Controller, Get } from '@nestjs/common'
import UserService from './users.service'
import { User } from '../db/entity'

@Controller('/api/user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Get()
  index(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get('/loggedin')
  findLoggedInUsers(): Promise<User[]> {
    return this.userService.findLoggedInUsers()
  }
}
