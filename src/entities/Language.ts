import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import User from './User'

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userSubmittedId' })
  userSubmittedId: User
}
