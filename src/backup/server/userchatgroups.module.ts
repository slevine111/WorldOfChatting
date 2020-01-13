import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserChatGroup } from '../../entities'
import UserChatGroupService from './userchatgroups.service'
import UserChatGroupController from './userchatgroups.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserChatGroup])],
  providers: [UserChatGroupService],
  controllers: [UserChatGroupController]
})
export default class UserChatGroupModule {}
