import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatGroupInvite } from '../../entities'
import { ChatGroupInviteStatusOptions } from '../../entities/ChatGroupInvite'
import { IChatGroupInvitePostDTO } from './chatgroupinvites.dto'

@Injectable()
export default class ChatGroupInviteService {
  constructor(
    @InjectRepository(ChatGroupInvite)
    private readonly inviteRepository: Repository<ChatGroupInvite>
  ) {}

  getChatGroupInvitesSentToSingleUser(
    targetUserId: string
  ): Promise<ChatGroupInvite[]> {
    return this.inviteRepository.query(
      `SELECT *
       FROM chat_group_invite
       WHERE "targetUserId" = $1 AND status = '${ChatGroupInviteStatusOptions.PENDING}'
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

  updateChatGroupInvite(
    id: string,
    updatedCgInvite: Partial<ChatGroupInvite>
  ): Promise<ChatGroupInvite> {
    return this.inviteRepository
      .findOneOrFail({ where: { id } })
      .then((cgInvite) => {
        return this.inviteRepository.save({
          ...cgInvite,
          ...updatedCgInvite,
        })
      })
  }
}
