import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import User from './User'

@Entity()
export default class ChatGroupInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderUserId' })
  senderUserId: string
}
