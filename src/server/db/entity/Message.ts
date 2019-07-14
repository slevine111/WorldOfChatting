import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm'
import { UserChatGroup } from './UserChatGroup'

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  body: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => UserChatGroup, userChatGroup => userChatGroup.messages)
  userChatGroup: UserChatGroup
}
