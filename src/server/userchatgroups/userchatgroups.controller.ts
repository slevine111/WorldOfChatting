import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import AuthGuard from '../auth/auth.guard'
import UserChatGroupService from './userchatgroups.service'
import { UserChatGroup } from '../../entities'

@Controller('/api/userchatgroup')
@UseGuards(AuthGuard)
export default class UserChatGroupController {
  constructor(private userChatGroupService: UserChatGroupService) {}

  @Get('/linked/:userId')
  getUserChatGroupsLinkedToUser(
    @Param('userId') userId: string
  ): Promise<UserChatGroup[]> {
    return this.userChatGroupService.getUserChatGroupsLinkedToUser(userId)
  }
}
