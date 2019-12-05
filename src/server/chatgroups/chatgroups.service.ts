import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatGroup } from '../../entities'
import { IChatGroupReducer } from '../../shared-types'

@Injectable()
export default class ChatGroupService {
  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatGroupRepository: Repository<ChatGroup>
  ) {}

  getFavoriteChatGroupsOfSingleUser(
    userId: string
  ): Promise<IChatGroupReducer[]> {
    return this.chatGroupRepository.query(
      `SELECT A.*, favorite
       FROM chat_group A
       JOIN user_chat_group B ON A.id = B."chatGroupId"
       WHERE "userId" = $1 AND favorite = true`,
      [userId]
    )
  }
}
