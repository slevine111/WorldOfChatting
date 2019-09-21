import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm'
import User from './User'
import ChatGroup from './ChatGroup'

@Entity()
export default class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  body: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, user => user.messages)
  user: User

  @ManyToOne(() => ChatGroup, chatGroup => chatGroup.messages)
  chatGroup: ChatGroup
}
