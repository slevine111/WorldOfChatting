import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import User from './User'
import ChatGroup from './ChatGroup'
import Message from './Message'

@Entity()
export default class UserChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'boolean', default: false })
  favorite: boolean

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'lastMessageSeenId' })
  lastMessageSeenId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: string

  @ManyToOne(() => ChatGroup)
  @JoinColumn({ name: 'chatGroupId' })
  chatGroupId: string
}
