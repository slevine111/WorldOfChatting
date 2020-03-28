import { NotificationTypes } from '../../entities/Notification'
import { Notification } from '../../entities'

export interface INotificationPostDTO {
  notificationType: NotificationTypes
  senderId: string
  targetUserId: string
}

export interface INotificationPutSingleObject {
  currentNotification: Notification
  updatedNotification: Partial<Notification>
}
