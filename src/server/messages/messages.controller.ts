import { Controller, Get, Param } from '@nestjs/common'
import MessageService from './messages.service'
import { Message } from '../../entities'

@Controller('/api/message')
export default class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/user/:userId')
  getMessagesLinkedToUser(@Param('userId') userId: string): Promise<Message[]> {
    return this.messageService.getMessagesLinkedToUser(userId)
  }
}
