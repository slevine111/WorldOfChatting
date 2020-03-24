import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from '../../entities'
import { NotificationTypes } from '../../entities/Notification'
import { INotificationPostDTO } from './notifications.dto'

@Injectable()
export default class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  getNotificationsSentToSingleUser(
    targetUserId: string
  ): Promise<Notification[]> {
    return this.notificationRepository.query(
      `SELECT *
       FROM notification
       WHERE "targetUserId" = $1
       ORDER BY "createdAt" DESC
      `,
      [targetUserId]
    )
  }

  async getNotificationsFromCurrentDate(
    notificationType: NotificationTypes,
    targetUserId: string
  ): Promise<Notification[]> {
    const currentDateTime: Date = new Date()
    const currentDate: Date = new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate()
    )
    return this.notificationRepository.find({
      where: { notificationType, targetUserId, createdAt: currentDate }
    })
  }

  createNotification(
    newNotification: INotificationPostDTO
  ): Promise<Notification> {
    const { senderId, targetUserId, notificationType } = newNotification
    return this.notificationRepository.save({
      notificationType,
      targetUserId,
      sendersUserIds: [senderId]
    })
  }

  async updateNotification(
    currentNotification: Notification,
    updatedNotification: Partial<Notification>
  ): Promise<Notification> {
    let ntUpdatedSendersUserIds: string[] = currentNotification.sendersUserIds
    const { sendersUserIds } = updatedNotification
    if (sendersUserIds !== undefined) {
      ntUpdatedSendersUserIds = [...ntUpdatedSendersUserIds, ...sendersUserIds]
    }

    const newCompleteNotification: Notification = {
      ...currentNotification,
      ...updatedNotification,
      sendersUserIds: ntUpdatedSendersUserIds
    }
    await this.notificationRepository.save(newCompleteNotification)
    return newCompleteNotification
  }
}
