import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserChatGroup } from '../../entities'

@Injectable()
export default class UserChatGroupService {
  constructor(
    @InjectRepository(UserChatGroup)
    private readonly userChatGroupRepository: Repository<UserChatGroup>
  ) {}

  getUserChatGroupsLinkedToUser(userId: string): Promise<UserChatGroup[]> {
    return this.userChatGroupRepository.query(
      `SELECT A.*
       FROM user_chat_group A
       JOIN (SELECT "chatGroupId" FROM user_chat_group WHERE "userId" = $1) B ON A."chatGroupId" = B."chatGroupId"
    `,
      [userId]
    )
  }
}
