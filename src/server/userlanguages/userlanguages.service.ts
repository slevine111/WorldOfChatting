import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLanguage } from '../../entities'
import { IUserLanguagePostDTO } from './userlanguages.dto'

@Injectable()
export default class UserLanguageService {
  constructor(
    @InjectRepository(UserLanguage)
    private readonly userLanguageRepository: Repository<UserLanguage>
  ) {}

  getUserLanguagesOfLanguage(language: string): Promise<UserLanguage[]> {
    return this.userLanguageRepository.query(
      `SELECT *
       FROM user_language
       WHERE language = $1`,
      [language]
    )
  }

  getUserLanguagesOfUser(userId: string): Promise<UserLanguage[]> {
    return this.userLanguageRepository.query(
      `SELECT *
       FROM user_language
       WHERE active = true AND "userId" = $1`,
      [userId]
    )
  }

  addNewUserLanguages(
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageRepository.save(newUserLanguages)
  }
}
