import { Controller, UseGuards, Get, Param } from '@nestjs/common'
import ChatGroupService from './chatgroups.service'
import AuthGuard from '../auth/auth.guard'
import { IChatGroupReducer } from '../../types-for-both-server-and-client'

@Controller('/api/chatgroup')
@UseGuards(AuthGuard)
export default class ChatGroupController {
  constructor(private chatGroupService: ChatGroupService) {}

  @Get('/:userId')
  getChatGroupsOfSingleUser(
    @Param('userId') userId: string
  ): Promise<IChatGroupReducer> {
    return this.chatGroupService.getChatGroupsOfSingleUser(userId)
  }
}
