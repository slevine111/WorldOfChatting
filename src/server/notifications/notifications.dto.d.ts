import { NotificationTypes } from '../../entities/Notification'

export interface INotificationPostDTO {
  notificationType: NotificationTypes
  senderId: string
  targetUserId: string
}
