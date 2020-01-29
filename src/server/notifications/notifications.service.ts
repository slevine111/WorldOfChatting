import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from '../../entities'
import { INotificationReducerFields } from '../../types-for-both-server-and-client'

@Injectable()
export default class ChatGroupService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  getNotificationsSentToSingleUser(
    targetUserId: string
  ): Promise<INotificationReducerFields[]> {
    return this.notificationRepository.query(
      `SELECT B.id,
              A."createdAt",
              A.body,
              B.read,
              A."senderId",
              A."notificationType"
       FROM notification A
       JOIN "notificationRecipient" B ON A.id = B."notificationId"
       WHERE B."targetUserId" = $1
       ORDER BY "createdAt" DESC
      `,
      [targetUserId]
    )
  }
}
