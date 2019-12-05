import { Controller, UseGuards, Get, Param } from '@nestjs/common'
import ChatGroupService from './chatgroups.service'
import AuthGuard from '../auth/auth.guard'
import { IChatGroupReducer } from '../../shared-types'

@Controller('/api/chatgroup')
@UseGuards(AuthGuard)
export default class ChatGroupController {
  constructor(private chatGroupService: ChatGroupService) {}

  @Get('/:userId/favorite')
  getFavoriteChatGroupsOfSingleUser(
    @Param('userId') userId: string
  ): Promise<IChatGroupReducer[]> {
    return this.chatGroupService.getFavoriteChatGroupsOfSingleUser(userId)
  }
}
