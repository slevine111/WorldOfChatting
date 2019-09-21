import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne
} from 'typeorm'
import User from './User'
import UserLanguage from './UserLanguage'
import ChatGroup from './ChatGroup'

@Entity()
export default class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  language: string

  @Column({ type: 'varchar', array: true, nullable: true })
  countries: string[]

  @Column({ type: 'varchar', array: true, nullable: true })
  usersApproved: User[]

  @ManyToOne(() => User, user => user.languages)
  userSubmitted: User

  @OneToMany(() => UserLanguage, userLanguage => userLanguage.language)
  userLanguages: UserLanguage[]

  @OneToMany(() => ChatGroup, chatGroup => chatGroup.language)
  chatGroups: ChatGroup[]
}
