import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatGroup } from '../../entities'
import {
  IChatGroupReducer,
  IChatGroupWithFavoriteField
} from '../../types-for-both-server-and-client'

@Injectable()
export default class ChatGroupService {
  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatGroupRepository: Repository<ChatGroup>
  ) {}

  getChatGroupsOfSingleUser(userId: string): Promise<IChatGroupReducer> {
    return this.chatGroupRepository
      .query(
        `SELECT A.*, favorite
       FROM chat_group A
       JOIN user_chat_group B ON A.id = B."chatGroupId"
       WHERE "userId" = $1`,
        [userId]
      )
      .then((chatGroups: IChatGroupWithFavoriteField[]) => {
        let chatGroupsByLanguage: IChatGroupReducer = {}
        for (let i = 0; i < chatGroups.length; ++i) {
          const { language } = chatGroups[i]
          if (chatGroupsByLanguage[language]) {
            chatGroupsByLanguage[language].push(chatGroups[i])
          } else {
            chatGroupsByLanguage[language] = [chatGroups[i]]
          }
        }
        return chatGroupsByLanguage
      })
  }
}
