import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import UserModule from './users/users.module'

@Module({
  imports: [UserModule, TypeOrmModule.forRoot()]
})
export default class ApplicationModule {}
