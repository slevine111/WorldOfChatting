import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from '../../entities'

@Injectable()
export default class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  getMessagesLinkedToUser(userId: string): Promise<Message[]> {
    return this.messageRepository.query(
      `SELECT A.* FROM message A
       JOIN (SELECT "chatGroupId" FROM user_chat_group WHERE "userId" = $1) B
       ON A."chatGroupId" = B."chatGroupId"`,
      [userId]
    )
  }
}
