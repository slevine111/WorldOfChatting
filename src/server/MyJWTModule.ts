import { JwtModule } from '@nestjs/jwt'
import { Module, Global } from '@nestjs/common'
import { config } from 'dotenv'

config()

@Global()
@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  exports: [JwtModule.register({ secret: process.env.JWT_SECRET })]
})
export default class MyJWTModule {}
