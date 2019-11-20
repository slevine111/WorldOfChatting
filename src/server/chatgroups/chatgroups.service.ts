import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatGroup } from '../../entities'

@Injectable()
export default class ChatGroupService {
  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatGroupRepository: Repository<ChatGroup>
  ) {}

  getChatGroupsOfSingleUser(userId: string): Promise<ChatGroup[]> {
    return this.chatGroupRepository.query(
      `SELECT A.*
         FROM chat_group A
         JOIN user_chat_group B ON A.id = B."chatGroupId"
         WHERE "userId" = $1`,
      [userId]
    )
  }
}
