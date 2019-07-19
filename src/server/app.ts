import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'dotenv'
import { resolve } from 'path'
import UserModule from './users/users.module'

config({ path: resolve(__dirname, '..', '..', '.env') })

@Module({
  imports: [UserModule, TypeOrmModule.forRoot({})]
})
export default class ApplicationModule {}
