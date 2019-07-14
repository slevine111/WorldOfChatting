import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { User } from './User'
import { ChatGroup } from './ChatGroup'
import { Message } from './Message'

@Entity()
export class UserChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, user => user.userChatGroups)
  user: User

  @ManyToOne(() => ChatGroup, chatGroup => chatGroup.userChatGroups)
  chatGroup: ChatGroup

  @OneToMany(() => Message, message => message.userChatGroup)
  messages: Message[]
}
