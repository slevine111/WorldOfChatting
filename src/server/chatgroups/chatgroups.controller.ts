import { Controller, UseGuards, Get, Param, Post, Body } from '@nestjs/common'
import ChatGroupService from './chatgroups.service'
import AuthGuard from '../auth/auth.guard'
import { IChatGroupPostDTO } from './chatgroups.dto'
import { IChatGroupAPIReturn } from '../../types-for-both-server-and-client'

@Controller('/api/chatgroup')
@UseGuards(AuthGuard)
export default class ChatGroupController {
  constructor(private chatGroupService: ChatGroupService) {}

  @Get('/:userId')
  getChatGroupsOfSingleUser(
    @Param('userId') userId: string
  ): Promise<IChatGroupAPIReturn[]> {
    return this.chatGroupService.getChatGroupsOfSingleUser(userId)
  }

  @Post()
  createChatGroup(
    @Body() newChatGroup: IChatGroupPostDTO
  ): Promise<IChatGroupAPIReturn> {
    return this.chatGroupService.createChatGroup(newChatGroup)
  }
}
