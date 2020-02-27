import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import UserChatGroupService from './userchatgroups.service'
import UserChatGroupController from './userchatgroups.controller'
import { UserChatGroup } from '../../entities'

@Module({
  imports: [TypeOrmModule.forFeature([UserChatGroup])],
  providers: [UserChatGroupService],
  controllers: [UserChatGroupController]
})
export default class UserChatGroupModule {}
