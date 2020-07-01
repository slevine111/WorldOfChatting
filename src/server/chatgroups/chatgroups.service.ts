import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IChatGroupPostDTO } from './chatgroups.dto'
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
      `SELECT A.*,
      favorite,
      "lastMessageSeenTimeStamp" = "datetimeLastMessage" IS TRUE AS "seenLastMessage",
      C."chatGroupId" IS NOT NULL AS "hasMessages"
      FROM chat_group A
      JOIN user_chat_group B ON A.id = B."chatGroupId"
      LEFT JOIN (SELECT "chatGroupId", MAX("createdAt") AS "datetimeLastMessage"  FROM message GROUP BY "chatGroupId") C ON A.id = C."chatGroupId"
      WHERE B."userId" = $1
      ORDER BY "datetimeLastMessage" DESC`,
      [userId]
    )
  }

  createChatGroup(
    newChatGroup: IChatGroupPostDTO
  ): Promise<IChatGroupAPIReturn> {
    return this.chatGroupRepository.save(newChatGroup).then((cg) => ({
      ...cg,
      favorite: false,
      seenLastMessage: true,
      hasMessages: false,
    }))
  }
}
