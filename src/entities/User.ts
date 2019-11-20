import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column('varchar')
  lastName: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true, select: false })
  password?: string

  @Column({ type: 'boolean', default: false })
  loggedIn: boolean
}
