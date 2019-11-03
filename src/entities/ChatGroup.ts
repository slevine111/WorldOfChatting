import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  //OneToMany,
  ManyToOne,
  JoinTable,
  JoinColumn
} from 'typeorm'
import User from './User'
//import Message from './Message'
import Language from './Language'

@Entity()
export default class ChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string

  @ManyToOne(() => Language /*, language => language.chatGroups*/)
  @JoinColumn({ name: 'languageId' })
  languageId: string

  /*@OneToMany(() => Message, message => message.chatGroup)
  messages: Message[]*/

  @ManyToMany(() => User, user => user.chatGroups)
  @JoinTable({ name: 'user_chatgroup' })
  userIds: string[]
}
