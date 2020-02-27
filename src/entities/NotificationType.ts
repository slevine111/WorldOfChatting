import { Entity, PrimaryColumn } from 'typeorm'

export enum NotificationTypeOptions {
  CHAT_GROUP_INVITE = 'chat group invite',
  CHAT_GROUP_INVITE_ACCEPTED = 'chat group invite accepted',
  CHAT_GROUP_INVITE_DECLINED = 'chat group invite declined'
}

@Entity()
export default class NotificationType {
  @PrimaryColumn({ type: 'varchar' })
  notificationType: NotificationTypeOptions
}
