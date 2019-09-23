import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import UserLanguageController from './userlanguages.controller'
import UserLanguageService from './userlanguages.service'
import { UserLanguage } from '../../entities'

@Module({
  imports: [TypeOrmModule.forFeature([UserLanguage])],
  controllers: [UserLanguageController],
  providers: [UserLanguageService]
})
export default class UserLanguageModule {}
