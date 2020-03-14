import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column
} from 'typeorm'
import User from './User'
import Language from './Language'

export enum NotificationTypes {
  CHAT_GROUP_INVITE_ACCEPTED = 'chat group invite accepted',
  CHAT_GROUP_INVITE_DECLINED = 'chat group invite declined'
}

@Entity()
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

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

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language' })
  language: string
}
