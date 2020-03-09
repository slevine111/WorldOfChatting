import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm'
import User from './User'

export enum NotificationTypes {
  CHAT_GROUP_INVITE_ACCEPTED = 'chat group invite accepted',
  CHAT_GROUP_INVITE_DECLINED = 'chat group invite declined'
}

@Entity()
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Column({ type: 'bool', default: false })
  read: boolean

  @Column({ enum: NotificationTypes })
  notificationType: NotificationTypes

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderUserId' })
  senderUserId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUserId: string
}
