import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatGroupInvite, ChatGroupInviteRecipient } from '../../entities'
import ChatGroupInviteController from './chatgroupinvites.controller'
import ChatGroupInviteService from './chatgroupinvites.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatGroupInvite, ChatGroupInviteRecipient])
  ],
  providers: [ChatGroupInviteService],
  controllers: [ChatGroupInviteController]
})
export default class ChatGroupInviteModule {}
