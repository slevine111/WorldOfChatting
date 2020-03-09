import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Put
} from '@nestjs/common'
import ChatGroupInviteService from './chatgroupinvites.service'
import { IChatGroupInviteReducerFields } from '../../types-for-both-server-and-client'
import { IChatGroupInvitePostDTO } from './chatgroupinvites.dto'
import { ChatGroupInvite, ChatGroupInviteRecipient } from '../../entities'
import AuthGuard from '../auth/auth.guard'

@Controller('/api/chatgroupinvite')
@UseGuards(AuthGuard)
export default class ChatGroupController {
  constructor(private chatgroupinviteService: ChatGroupInviteService) {}

  @Get('/:targetUserId')
  getChatGroupInvitesSentToSingleUser(
    @Param('targetUserId') targetUserId: string
  ): Promise<IChatGroupInviteReducerFields[]> {
    return this.chatgroupinviteService.getChatGroupInvitesSentToSingleUser(
      targetUserId
    )
  }

  @Post()
  createNewChatGroupInvite(
    @Body() newChatGroupInvite: IChatGroupInvitePostDTO
  ): Promise<ChatGroupInvite> {
    return this.chatgroupinviteService.createChatGroupInvite(newChatGroupInvite)
  }

  @Post('/chatgroupinviteRecipient/single')
  createNewChatGroupInviteRecipient(
    @Body()
    newChatGroupInviteObject: {
      targetUserId: string
      newChatGroupInvite: ChatGroupInvite
    }
  ): Promise<IChatGroupInviteReducerFields> {
    const { targetUserId, newChatGroupInvite } = newChatGroupInviteObject
    return this.chatgroupinviteService.createChatGroupInviteRecipent(
      targetUserId,
      newChatGroupInvite
    )
  }

  @Put('/recipient/:cgInviteRecipientId')
  updateChatGroupInviteRecipent(
    @Param('cgInviteRecipientId') cgInviteRecipientId: string,
    @Body() updatedCgInviteRecipientFields: Partial<ChatGroupInviteRecipient>
  ): Promise<ChatGroupInviteRecipient> {
    return this.chatgroupinviteService.updateChatGroupInviteRecipent(
      cgInviteRecipientId,
      updatedCgInviteRecipientFields
    )
  }
}
