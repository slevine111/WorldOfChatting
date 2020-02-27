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

  createUserChatGroups(
    newUserChatGroups: IUserChatGroupPostDTO[]
  ): Promise<UserChatGroup[]> {
    return this.userChatGroupRepository.save(newUserChatGroups)
  }
}
