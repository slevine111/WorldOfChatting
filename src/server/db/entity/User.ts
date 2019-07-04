import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Message } from './Message'
import { UserLanguage } from './UserLanguage'
import { UserChatGroup } from './UserChatGroup'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  firatName: string

  @Column('varchar')
  laatName: string

  @Column({ type: 'varchar', unique: true })
  username: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true })
  password: string

  @OneToMany(type => Message, message => message.user)
  messages: Message[]

  @OneToMany(type => UserLanguage, userLanguage => userLanguage.user)
  userLanguages: UserLanguage[]

  @OneToMany(type => UserChatGroup, userChatGroup => userChatGroup.user)
  userChatGroups: UserChatGroup[]
}
