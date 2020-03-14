import { NotificationTypes } from '../../entities/Notification'

export interface INotificationPostDTO {
  notificationType: NotificationTypes
  senderUserId: string
  targetUserId: string
  language: string
}
