import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import User from './User'
import NotificationType from './NotificationType'

@Entity()
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @ManyToOne(() => NotificationType)
  @JoinColumn({ name: 'notificationType' })
  notificationType: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  senderId: string
}
