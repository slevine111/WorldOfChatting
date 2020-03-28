import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from '../../entities'
import { NotificationTypes } from '../../entities/Notification'
import {
  INotificationPostDTO,
  INotificationPutSingleObject
} from './notifications.dto'

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
       ORDER BY "updatedAtSendersCol" DESC, seen, "clickedOn"
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

  generateUpdatedNotification(
    currentNotification: Notification,
    updatedNotification: Partial<Notification>
  ): Notification {
    let {
      sendersUserIds: ntUpdatedSendersUserIds,
      updatedAtSendersCol
    } = currentNotification
    const { sendersUserIds } = updatedNotification
    if (sendersUserIds !== undefined) {
      ntUpdatedSendersUserIds = [...ntUpdatedSendersUserIds, ...sendersUserIds]
    }

    return {
      ...currentNotification,
      ...updatedNotification,
      sendersUserIds: ntUpdatedSendersUserIds,
      updatedAtSendersCol:
        sendersUserIds !== undefined ? new Date() : updatedAtSendersCol
    }
  }

  async updateNotification(
    currentNotification: Notification,
    updatedNotification: Partial<Notification>
  ): Promise<Notification> {
    const newCompleteNotification: Notification = this.generateUpdatedNotification(
      currentNotification,
      updatedNotification
    )
    await this.notificationRepository.save(newCompleteNotification)
    return newCompleteNotification
  }

  async updateMultipleNotifications(
    notificationsPutObjects: INotificationPutSingleObject[]
  ): Promise<Notification[]> {
    let newCompleteNotifications: Notification[] = []
    for (let i = 0; i < notificationsPutObjects.length; ++i) {
      const {
        currentNotification,
        updatedNotification
      } = notificationsPutObjects[i]
      newCompleteNotifications.push(
        this.generateUpdatedNotification(
          currentNotification,
          updatedNotification
        )
      )
    }
    await this.notificationRepository.save(newCompleteNotifications)
    return newCompleteNotifications
  }
}
