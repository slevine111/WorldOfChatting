import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from '../../entities'
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
       ORDER BY "updatedAt" DESC
      `,
      [targetUserId]
    )
  }

  createNotification(
    newNotification: INotificationPostDTO
  ): Promise<Notification> {
    return this.notificationRepository.save(newNotification)
  }
}
