import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import User from './User'
import Language from './Language'

@Entity()
export default class UserLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ enum: ['learner', 'teacher'] })
  type: string

  @Column({ type: 'int', nullable: true })
  numberOfYears: number

  @ManyToOne(() => User, user => user.userLanguages)
  user: User

  @ManyToOne(() => Language, language => language.userLanguages)
  language: Language
}
