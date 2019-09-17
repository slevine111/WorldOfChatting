import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { UserLanguage } from './UserLanguage'
import { UserChatGroup } from './UserChatGroup'
import CountryLanguage from './CountryLanguage'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column('varchar')
  lastName: string

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

  @OneToMany(
    () => CountryLanguage,
    countryLanguage => countryLanguage.userSubmitted
  )
  countryLanguages: CountryLanguage[]
}
