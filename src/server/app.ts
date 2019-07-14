import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'dotenv'
import { resolve } from 'path'
import UserModule from './users/users.module'

config({ path: resolve(__dirname, '..', '..', '.env') })

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.PORTDB),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [resolve(__dirname, 'db', 'entity', '*.js')]
    })
  ]
})
export default class ApplicationModule {}
