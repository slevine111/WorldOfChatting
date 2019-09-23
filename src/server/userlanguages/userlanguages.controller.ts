import { Controller, Post, Body } from '@nestjs/common'
import UserLanguageService from './userlanguages.service'
import { UserLanguage } from '../../entities'
import { IUserLanguagePostDTO } from './userlanguages.dto'

@Controller('/api/userlanguage')
export default class UserLanguageController {
  constructor(private userLanguageService: UserLanguageService) {}

  @Post()
  addNewUserLanguages(
    @Body()
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageService.addNewUserLanguages(newUserLanguages)
  }
}
