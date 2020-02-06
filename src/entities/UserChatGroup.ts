import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import User from './User'
import ChatGroup from './ChatGroup'

@Entity()
export default class UserChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'boolean', default: false })
  favorite: boolean

  @Column({ type: 'timestamptz', nullable: true })
  lastMessageSeenTimeStamp: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: string

  @ManyToOne(() => ChatGroup)
  @JoinColumn({ name: 'chatGroupId' })
  chatGroupId: string
}
