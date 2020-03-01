import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification, NotificationRecipient } from '../../entities'
import { NotificationTypeOptions } from '../../entities/NotificationType'
import { NtRecipientStatusOptions } from '../../entities/NotificationRecipient'
import { INotificationReducerFields } from '../../types-for-both-server-and-client'
import { INotificationPostDTO } from './notifications.dto'

@Injectable()
export default class NotificationService {
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
              B."updatedAt",
              B.status,
              A."senderId",
              A."notificationType",
              B."targetUserId"
       FROM notification A
       JOIN notification_recipient B ON A.id = B."notificationId"
       WHERE B."targetUserId" = $1 OR (A."senderId" = $2 AND A."notificationType" = '${NotificationTypeOptions.CHAT_GROUP_INVITE}')
       ORDER BY "createdAt" DESC
      `,
      [targetUserId, targetUserId]
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
      .save({
        targetUserId,
        status: NtRecipientStatusOptions.UNREAD,
        notificationId: newNotification.id
      })
      .then(ntRecipient => {
        const { id, status, targetUserId, updatedAt } = ntRecipient
        const { createdAt, senderId, notificationType } = newNotification
        return {
          id,
          createdAt,
          updatedAt,
          status,
          senderId,
          notificationType,
          targetUserId
        }
      })
  }

  updateNotificationRecipent(
    ntRecipientid: string,
    updatedNtRecipient: Partial<NotificationRecipient>
  ): Promise<NotificationRecipient> {
    return this.ntRecipientRepository
      .findOneOrFail({ where: { id: ntRecipientid } })
      .then(ntRecipient => {
        return this.ntRecipientRepository.save({
          ...ntRecipient,
          ...updatedNtRecipient
        })
      })
  }
}
