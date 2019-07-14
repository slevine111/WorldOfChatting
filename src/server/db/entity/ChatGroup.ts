import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { UserChatGroup } from './UserChatGroup'

@Entity()
export class ChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  language: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string

  @OneToMany(() => UserChatGroup, userChatGroup => userChatGroup.chatGroup)
  userChatGroups: UserChatGroup[]
}
