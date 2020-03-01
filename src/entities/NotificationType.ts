import { Entity, PrimaryColumn } from 'typeorm'

export enum NotificationTypeOptions {
  CHAT_GROUP_INVITE = 'chat group invite'
}

@Entity()
export default class NotificationType {
  @PrimaryColumn({ type: 'varchar' })
  notificationType: NotificationTypeOptions
}
