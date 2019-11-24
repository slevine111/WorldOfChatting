import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm'
import Language from './Language'
import UserChatGroup from './UserChatGroup'

@Entity()
export default class ChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  name: string

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language' })
  language: string

  @OneToMany(
    () => UserChatGroup,
    userChatGroup => userChatGroup.chatGroupId
  )
  userChatGroups?: UserChatGroup[]
}
