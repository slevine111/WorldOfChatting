import { Module } from '@nestjs/common'
import AuthService from './auth.service'
import UserModule from '../users/users.module'
import AuthController from './auth.controller'

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService]
})
export default class AuthModule {}
