import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
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

  @ManyToOne(type => UserChatGroup, userChatGroup => userChatGroup.messages)
  userChatGroup: UserChatGroup
}
