import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import UserLanguageService from './userlanguages.service'
import AuthGuard from '../auth/auth.guard'
import { UserLanguage } from '../../entities'
import { IUserLanguagePostDTO } from './userlanguages.dto'
import { IUserLangugeWithOnlineUserCount } from '../../shared-types'

@Controller('/api/userlanguage')
export default class UserLanguageController {
  constructor(private userLanguageService: UserLanguageService) {}

  @Get('/language/:language')
  @UseGuards(AuthGuard)
  getUserLanguagesOfLanguage(
    @Param('language') language: string
  ): Promise<UserLanguage[]> {
    return this.userLanguageService.getUserLanguagesOfLanguage(language)
  }

  @Get('/linked/:userId')
  @UseGuards(AuthGuard)
  getUserCountByLanguage(
    @Param('userId') userId: string
  ): Promise<IUserLangugeWithOnlineUserCount[]> {
    return this.userLanguageService.getUserLanguagesOfUser(userId)
  }

  @Post()
  addNewUserLanguages(
    @Body()
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageService.addNewUserLanguages(newUserLanguages)
  }
}
