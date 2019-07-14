import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class UserLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ enum: ['learner', 'teacher'] })
  type: string

  @Column('varchar')
  language: string

  @Column({ type: 'int', nullable: true })
  numberOfYears: number

  @ManyToOne(() => User, user => user.userLanguages)
  user: User
}
