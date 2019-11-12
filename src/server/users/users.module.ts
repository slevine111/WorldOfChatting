import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import UserController from './users.controller'
import UserService from './users.service'
import { User } from '../../entities'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export default class UserModule {}
