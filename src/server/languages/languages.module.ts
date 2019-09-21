import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import LanguageService from './languages.service'
import LanguageController from './languages.controller'
import { Language } from '../../entities'

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguageController],
  providers: [LanguageService]
})
export default class LanguageModule {}
