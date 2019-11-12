import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import UserLanguageService from './userlanguages.service'
import AuthGuard from '../auth/auth.guard'
import { UserLanguage } from '../../entities'
import { IUserLanguagePostDTO } from './userlanguages.dto'

@Controller('/api/userlanguage')
export default class UserLanguageController {
  constructor(private userLanguageService: UserLanguageService) {}

  @Get('/linked/:userId')
  @UseGuards(AuthGuard)
  getUserLanguagesLinkedToUser(
    @Param('userId') userId: string
  ): Promise<UserLanguage[]> {
    return this.userLanguageService.getUserLanguagesLinkedToUser(userId)
  }

  @Post()
  addNewUserLanguages(
    @Body()
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageService.addNewUserLanguages(newUserLanguages)
  }
}
