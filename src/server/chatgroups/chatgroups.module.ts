import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatGroup } from '../../entities'
import ChatGroupController from './chatgroups.controller'
import ChatGroupService from './chatgroups.service'

@Module({
  imports: [TypeOrmModule.forFeature([ChatGroup])],
  providers: [ChatGroupService],
  controllers: [ChatGroupController]
})
export default class ChatGroupModule {}
