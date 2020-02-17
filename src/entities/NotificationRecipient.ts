import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import Notification from './Notification'
import User from './User'

@Entity()
export default class NotificationRecipient {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'boolean', default: false })
  read: boolean

  @ManyToOne(() => Notification)
  @JoinColumn({ name: 'notificationId' })
  notificationId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUserId: string
}
