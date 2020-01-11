import { Controller, Get } from '@nestjs/common'
import LanguageService from './languages.service'
import { Language } from '../../entities'

@Controller('/api/language')
export default class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('')
  index(): Promise<Language[]> {
    return this.languageService.getAll()
  }
}
