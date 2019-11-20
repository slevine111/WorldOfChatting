import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import Language from './Language'

@Entity()
export default class ChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageId' })
  languageId: string
}
