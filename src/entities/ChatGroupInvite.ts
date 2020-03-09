import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import User from './User'
import Language from './Language'

@Entity()
export default class ChatGroupInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderUserId' })
  senderUserId: string

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language' })
  language: string
}
