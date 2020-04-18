import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

export enum OnlineStatuses {
  OFFLINE = 'Offline',
  ONLINE = 'Online',
}

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  firstName: string

  @Column('varchar')
  lastName: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true, select: false })
  password?: string

  @Column({ enum: OnlineStatuses, default: OnlineStatuses.OFFLINE })
  onlineStatus: OnlineStatuses
}
