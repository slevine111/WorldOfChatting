import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatGroup } from '../../entities'
import { IChatGroupAPIReturn } from '../../types-for-both-server-and-client'

@Injectable()
export default class ChatGroupService {
  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatGroupRepository: Repository<ChatGroup>
  ) {}

  getChatGroupsOfSingleUser(userId: string): Promise<IChatGroupAPIReturn[]> {
    return this.chatGroupRepository.query(
      `SELECT A.*, favorite, "lastMessageSeenTimeStamp"
         FROM chat_group A
         JOIN user_chat_group B ON A.id = B."chatGroupId"
         WHERE "userId" = $1`,
      [userId]
    )
  }
}
