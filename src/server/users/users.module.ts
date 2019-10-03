import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import UserController from './users.controller'
import UserService from './users.service'
import AuthGuard from '../auth/auth.guard'
import { User } from '../../entities'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, AuthGuard],
  exports: [UserService],
  controllers: [UserController]
})
export default class UserModule {}
