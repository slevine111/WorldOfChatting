import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

export enum OnlineStatusesEnum {
  OFFLINE = 'Offline',
  ONLINE = 'Online',
  AWAY = 'Away',
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

  @Column({ enum: OnlineStatusesEnum, default: OnlineStatusesEnum.OFFLINE })
  loggedIn: OnlineStatusesEnum
}
