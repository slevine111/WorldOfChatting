import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import User from './User'

export enum ChatGroupInviteStatusOptions {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity()
export default class ChatGroupInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  createdAt: Date

  @Column({
    enum: ChatGroupInviteStatusOptions,
    default: ChatGroupInviteStatusOptions.PENDING,
  })
  status: ChatGroupInviteStatusOptions

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  senderId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUserId: string
}
