import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { User } from './User'
import { ChatGroup } from './ChatGroup'
import { Message } from './Message'

@Entity()
export class UserChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => User, user => user.userChatGroups)
  user: User

  @ManyToOne(type => ChatGroup, chatGroup => chatGroup.userChatGroups)
  chatGroup: ChatGroup

  @OneToMany(type => Message, message => message.userChatGroup)
  messages: Message[]
}
