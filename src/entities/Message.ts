import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
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

  @ManyToOne(() => User /*, user => user.messages*/)
  @JoinColumn({ name: 'userId' })
  userId: string

  @ManyToOne(() => ChatGroup /*, chatGroup => chatGroup.messages*/)
  @JoinColumn({ name: 'chatGroupId' })
  chatGroupId: string
}
