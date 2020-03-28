import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @CreateDateColumn({ type: 'date' })
  createdAt: Date

  @Column({ type: 'timestamptz', default: new Date() })
  updatedAtSendersCol: Date

  @Column({ enum: NotificationTypes })
  notificationType: NotificationTypes

  @Column({ type: 'bool', default: false })
  clickedOn: boolean

  @Column({ type: 'bool', default: false })
  seen: boolean

  @Column('uuid', { array: true })
  sendersUserIds: string[]

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUserId: string
}
