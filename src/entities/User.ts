import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  //OneToMany,
  ManyToMany
} from 'typeorm'
//import UserLanguage from './UserLanguage'
import ChatGroup from './ChatGroup'
//import Message from './Message'
//import Language from './Language'

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column('varchar')
  lastName: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true, select: false })
  password?: string

  @Column({ type: 'boolean', default: false })
  loggedIn: boolean

  /*@OneToMany(() => UserLanguage, userLanguage => userLanguage.user)
  userLanguages?: UserLanguage[]

  @OneToMany(() => Message, message => message.user)
  messages?: Message[]

  @OneToMany(() => Language, language => language.userSubmitted)
  languages?: Language[]*/

  @ManyToMany(() => ChatGroup, chatGroup => chatGroup.users)
  chatGroups?: ChatGroup[]
}
