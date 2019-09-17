import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity()
export default class CountryLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  country: string

  @Column({ type: 'varchar', nullable: false })
  language: string

  @Column({ type: 'boolean', nullable: false })
  official: boolean

  @Column({ type: 'simple-array', nullable: true })
  usersApproved: string[]

  @ManyToOne(() => User, user => user.countryLanguages)
  userSubmitted: User
}
