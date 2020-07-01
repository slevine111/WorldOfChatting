import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Put,
} from '@nestjs/common'
import ChatGroupInviteService from './chatgroupinvites.service'
import { IChatGroupInvitePostDTO } from './chatgroupinvites.dto'
import { ChatGroupInvite } from '../../entities'
import AuthGuard from '../auth/auth.guard'

@Controller('/api/chatgroupinvite')
@UseGuards(AuthGuard)
export default class ChatGroupController {
  constructor(private chatgroupinviteService: ChatGroupInviteService) {}

  @Get('/:targetUserId')
  getChatGroupInvitesSentToSingleUser(
    @Param('targetUserId') targetUserId: string
  ): Promise<ChatGroupInvite[]> {
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

  /*@Post('/chatgroupinviteRecipient/single')
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
  }*/

  @Put('/:id')
  updateChatGroupInviteRecipent(
    @Param('id') id: string,
    @Body() updatedCgInviteFields: Partial<ChatGroupInvite>
  ): Promise<ChatGroupInvite> {
    return this.chatgroupinviteService.updateChatGroupInvite(
      id,
      updatedCgInviteFields
    )
  }
}
