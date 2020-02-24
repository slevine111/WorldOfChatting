import { NotificationTypeOptions } from '../../entities/NotificationType'

export interface INotificationPostDTO {
  notificationType: NotificationTypeOptions
  senderId: string
}
