import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import Notification from './Notification'
import User from './User'

export enum NtRecipientStatusOptions {
  UNREAD = 'unread',
  READ = 'read',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

@Entity()
export default class NotificationRecipient {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Column({
    enum: NtRecipientStatusOptions,
    default: NtRecipientStatusOptions.UNREAD
  })
  status: NtRecipientStatusOptions

  @ManyToOne(() => Notification)
  @JoinColumn({ name: 'notificationId' })
  notificationId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUserId: string
}
