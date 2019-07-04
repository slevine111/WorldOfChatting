import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { UserChatGroup } from './UserChatGroup'

@Entity()
export class ChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100 })
  name: string

  @OneToMany(type => UserChatGroup, userChatGroup => userChatGroup.chatGroup)
  userChatGroups: UserChatGroup[]
}
