import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import Language from './Language'

@Entity()
export default class ChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  name: string

  @Column('boolean')
  directChat: boolean

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language' })
  language?: string
}
