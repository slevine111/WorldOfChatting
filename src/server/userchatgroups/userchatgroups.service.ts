import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IUserChatGroupPostDTO } from './userchatgroups.dto'
import { UserChatGroup } from '../../entities'

@Injectable()
export default class UserChatGroupService {
  constructor(
    @InjectRepository(UserChatGroup)
    private readonly userChatGroupRepository: Repository<UserChatGroup>
  ) {}

  getUserChatGroupsLinked(userId: string): Promise<UserChatGroup[]> {
    return this.userChatGroupRepository.query(
      `
    SELECT A.*
    FROM user_chat_group A
    JOIN (SELECT "chatGroupId" FROM user_chat_group WHERE "userId" = $1) B
    ON A."chatGroupId" = B."chatGroupId"
    WHERE A."userId" != $2
    `,
      [userId, userId]
    )
  }

  createUserChatGroups(
    newUserChatGroups: IUserChatGroupPostDTO[]
  ): Promise<UserChatGroup[]> {
    return this.userChatGroupRepository.save(newUserChatGroups)
  }

  updateUserChatGroup(
    userId: string,
    chatGroupId: string,
    updatedUserChatGroup: Partial<UserChatGroup>
  ): Promise<UserChatGroup> {
    return this.userChatGroupRepository
      .findOneOrFail({ where: { userId, chatGroupId } })
      .then((userChatGroup) => {
        return this.userChatGroupRepository.save({
          ...userChatGroup,
          ...updatedUserChatGroup,
        })
      })
  }
}
