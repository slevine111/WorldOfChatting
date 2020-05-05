import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatGroupInvite, ChatGroupInviteRecipient } from '../../entities'
import { ChatGroupInviteStatusOptions } from '../../entities/ChatGroupInviteRecipient'
import { IChatGroupInviteReducerFields } from '../../types-for-both-server-and-client'
import { IChatGroupInvitePostDTO } from './chatgroupinvites.dto'

@Injectable()
export default class ChatGroupInviteService {
  constructor(
    @InjectRepository(ChatGroupInvite)
    private readonly inviteRepository: Repository<ChatGroupInvite>,
    @InjectRepository(ChatGroupInviteRecipient)
    private readonly inviteRecipientRepository: Repository<
      ChatGroupInviteRecipient
    >
  ) {}

  getChatGroupInvitesSentToSingleUser(
    targetUserId: string
  ): Promise<IChatGroupInviteReducerFields[]> {
    return this.inviteRepository.query(
      `SELECT B.id,
              A."createdAt",
              --A.language,
              B.status,
              A."senderUserId",
              B."targetUserId"
       FROM chat_group_invite A
       JOIN chat_group_invite_recipient B ON A.id = B."chatGroupInviteId"
       WHERE B."targetUserId" = $1 AND status = '${ChatGroupInviteStatusOptions.PENDING}'
       ORDER BY "createdAt" DESC
      `,
      [targetUserId]
    )
  }

  createChatGroupInvite(
    newChatGroupInvite: IChatGroupInvitePostDTO
  ): Promise<ChatGroupInvite> {
    return this.inviteRepository.save(newChatGroupInvite)
  }

  createChatGroupInviteRecipent(
    targetUserId: string,
    newChatGroupInvite: ChatGroupInvite
  ): Promise<IChatGroupInviteReducerFields> {
    return this.inviteRecipientRepository
      .save({
        targetUserId,
        chatGroupInviteId: newChatGroupInvite.id,
      })
      .then((cgInviteRecipient) => {
        const { id, status, targetUserId } = cgInviteRecipient
        const { createdAt, senderUserId } = newChatGroupInvite
        return {
          id,
          createdAt,
          status,
          senderUserId,
          targetUserId,
        }
      })
  }

  updateChatGroupInviteRecipent(
    cgInviteRecipientid: string,
    updatedCgInviteRecipient: Partial<ChatGroupInviteRecipient>
  ): Promise<ChatGroupInviteRecipient> {
    return this.inviteRecipientRepository
      .findOneOrFail({ where: { id: cgInviteRecipientid } })
      .then((cgInviteRecipient) => {
        return this.inviteRecipientRepository.save({
          ...cgInviteRecipient,
          ...updatedCgInviteRecipient,
        })
      })
  }
}
