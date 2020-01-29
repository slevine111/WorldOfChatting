import { Entity, PrimaryColumn } from 'typeorm'

export enum NotificationTypeOptions {
  CHAT_GROU_INVITE = 'chat group invite'
}

@Entity()
export default class NotifcationType {
  @PrimaryColumn({ type: 'varchar' })
  notifcationType: NotificationTypeOptions
}
