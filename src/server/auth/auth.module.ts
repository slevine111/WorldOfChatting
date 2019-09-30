import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import AuthService from './auth.service'
import UserModule from '../users/users.module'
import AuthController from './auth.controller'
import { config } from 'dotenv'

config()

@Module({
  imports: [UserModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [AuthController],
  providers: [AuthService]
})
export default class AuthModule {}
