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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: string

  @ManyToOne(() => ChatGroup)
  @JoinColumn({ name: 'chatGroupId' })
  chatGroupId: string
}
