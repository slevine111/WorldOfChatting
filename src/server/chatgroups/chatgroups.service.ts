import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatGroup } from '../../entities'

interface IChatGroupQueryReturn {
  id: string
  name: string
  languageId: string
  userId: string
}

interface IObjectOfChatGroups {
  [key: string]: ChatGroup
}

@Injectable()
export default class ChatGroupService {
  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatGroupRepository: Repository<ChatGroup>
  ) {}

  getChatGroupsOfSingleUser(userId: string): Promise<ChatGroup[]> {
    return this.chatGroupRepository
      .query(
        `SELECT id, name, "languageId", "userId"
         FROM chat_group A
         JOIN user_chatgroup B ON A.id = B."chatGroupId"
         JOIN (SELECT "chatGroupId" FROM user_chatgroup WHERE "userId" = $1) C
         ON B."chatGroupId" = C."chatGroupId"`,
        [userId]
      )
      .then((groupAndUserRows: IChatGroupQueryReturn[]) => {
        let objectOfChatGroups: IObjectOfChatGroups = {}
        for (let i = 0; i < groupAndUserRows.length; ++i) {
          const { id, name, languageId, userId } = groupAndUserRows[i]
          if (objectOfChatGroups[id]) {
            objectOfChatGroups[id].userIds.push(userId)
          } else {
            objectOfChatGroups[id] = { id, name, languageId, userIds: [userId] }
          }
        }
        return Object.values(objectOfChatGroups)
      })
  }
}
