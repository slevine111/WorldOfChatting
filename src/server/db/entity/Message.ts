import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  body: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(type => User, user => user.messages)
  @JoinColumn({ name: 'authorId' })
  user: User
}
