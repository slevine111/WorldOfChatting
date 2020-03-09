import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import User from './User'
import ChatGroupInvite from './ChatGroupInvite'

export enum ChatGroupInviteStatusOptions {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

@Entity()
export default class ChatGroupInviteRecipient {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    enum: ChatGroupInviteStatusOptions,
    default: ChatGroupInviteStatusOptions.PENDING
  })
  status: ChatGroupInviteStatusOptions

  @ManyToOne(() => ChatGroupInvite)
  @JoinColumn({ name: 'chatGroupInviteId' })
  chatGroupInviteId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUserId: string
}
