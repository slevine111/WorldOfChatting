import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { UserLanguage } from './UserLanguage'
import { UserChatGroup } from './UserChatGroup'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  firstName: string

  @Column('varchar')
  lastName: string

  @Column({ type: 'varchar', unique: true })
  username: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true })
  password: string

  @Column({ type: 'boolean', default: false })
  loggedIn: boolean

  @OneToMany(() => UserLanguage, userLanguage => userLanguage.user)
  userLanguages: UserLanguage[]

  @OneToMany(() => UserChatGroup, userChatGroup => userChatGroup.user)
  userChatGroups: UserChatGroup[]
}
