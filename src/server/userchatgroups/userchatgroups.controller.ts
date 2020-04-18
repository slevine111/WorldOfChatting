import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
import AuthGuard from '../auth/auth.guard'
import { IUserChatGroupPostDTO } from './userchatgroups.dto'
import { UserChatGroup } from '../../entities'
import UserChatGroupService from './userchatgroups.service'

@Controller('/api/userchatgroup')
@UseGuards(AuthGuard)
export default class UserChatGroupController {
  constructor(private readonly userChatGroupService: UserChatGroupService) {}

  @Get('/:userId/linkedto')
  getUserChatGroupsLinked(
    @Param('userId') userId: string
  ): Promise<UserChatGroup[]> {
    return this.userChatGroupService.getUserChatGroupsLinked(userId)
  }

  @Post()
  createNewUserChatGroups(
    @Body() newUserChatGroups: IUserChatGroupPostDTO[]
  ): Promise<UserChatGroup[]> {
    return this.userChatGroupService.createUserChatGroups(newUserChatGroups)
  }
}
