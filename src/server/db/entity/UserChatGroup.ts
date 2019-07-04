import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './User'
import { ChatGroup } from './ChatGroup'

@Entity()
export class UserChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => User, user => user.userChatGroups)
  user: User

  @ManyToOne(type => ChatGroup, chatGroup => chatGroup.userChatGroups)
  chatGroup: ChatGroup
}
