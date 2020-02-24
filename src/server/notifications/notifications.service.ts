import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification, NotificationRecipient } from '../../entities'
import { INotificationReducerFields } from '../../types-for-both-server-and-client'
import { INotificationPostDTO } from './notifications.dto'

@Injectable()
export default class ChatGroupService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationRecipient)
    private readonly ntRecipientRepository: Repository<NotificationRecipient>
  ) {}

  getNotificationsSentToSingleUser(
    targetUserId: string
  ): Promise<INotificationReducerFields[]> {
    return this.notificationRepository.query(
      `SELECT B.id,
              A."createdAt",
              B.read,
              A."senderId",
              A."notificationType",
              B."targetUserId"
       FROM notification A
       JOIN notification_recipient B ON A.id = B."notificationId"
       WHERE B."targetUserId" = $1
       ORDER BY "createdAt" DESC
      `,
      [targetUserId]
    )
  }

  createNotification(
    newNotification: INotificationPostDTO
  ): Promise<Notification> {
    return this.notificationRepository.save(newNotification)
  }

  createNotificationRecipent(
    targetUserId: string,
    newNotification: Notification
  ): Promise<INotificationReducerFields> {
    return this.ntRecipientRepository
      .save({ targetUserId, notificationId: newNotification.id })
      .then(ntRecipient => {
        const { id, read, targetUserId } = ntRecipient
        const { createdAt, senderId, notificationType } = newNotification
        return {
          id,
          createdAt,
          read,
          senderId,
          notificationType,
          targetUserId
        }
      })
  }
}
