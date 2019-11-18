import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import User from './User'
import Language from './Language'

export type UserLanguageTypeFieldOptions = 'learner' | 'teacher'

@Entity()
export default class UserLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ enum: ['learner', 'teacher'] })
  type: UserLanguageTypeFieldOptions

  @Column({ type: 'int', nullable: true })
  numberOfYears: number | null

  @Column({ enum: [true, false], default: true })
  active: Boolean

  @ManyToOne(() => User /*, user => user.userLanguages*/)
  @JoinColumn({ name: 'userId' })
  userId: string

  @ManyToOne(() => Language /*, language => language.userLanguages*/)
  @JoinColumn({ name: 'languageId' })
  languageId: string
}
