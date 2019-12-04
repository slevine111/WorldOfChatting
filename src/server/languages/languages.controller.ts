import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import LanguageService from './languages.service'
import { Language } from '../../entities'
import { ILanguageWithActiveField } from '../../shared-types'
import AuthGuard from '../auth/auth.guard'

@Controller('/api/language')
export default class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('')
  index(): Promise<Language[]> {
    return this.languageService.getAll()
  }

  @Get('/:userId')
  @UseGuards(AuthGuard)
  getLanguagesOfUser(
    @Param('userId') userId: string
  ): Promise<ILanguageWithActiveField[]> {
    return this.languageService.getLanguagesOfUser(userId)
  }
}
