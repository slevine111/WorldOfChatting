import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm'
import User from './User'

@Entity()
export default class Language {
  @PrimaryColumn({ type: 'varchar' })
  language: string

  @Column({ type: 'varchar', array: true, nullable: true })
  countries: string[]

  @Column({ type: 'varchar', array: true, nullable: true })
  usersApproved: string[]

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userSubmittedId' })
  userSubmittedId: string
}
