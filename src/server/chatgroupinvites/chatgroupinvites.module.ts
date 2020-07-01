import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatGroupInvite } from '../../entities'
import ChatGroupInviteController from './chatgroupinvites.controller'
import ChatGroupInviteService from './chatgroupinvites.service'

@Module({
  imports: [TypeOrmModule.forFeature([ChatGroupInvite])],
  providers: [ChatGroupInviteService],
  controllers: [ChatGroupInviteController],
})
export default class ChatGroupInviteModule {}
