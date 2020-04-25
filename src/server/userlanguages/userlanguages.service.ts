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

  getUserLanguagesLinkedToUser(userId: string): Promise<UserLanguage[]> {
    return this.userLanguageRepository.query(
      `SELECT A.*
       FROM user_language A
       JOIN (SELECT language
             FROM user_language
             WHERE "userId" = $1 AND active = true) B
       ON A.language = B.language
       WHERE active = true`,
      [userId]
    )
  }

  addNewUserLanguages(
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageRepository.save(newUserLanguages)
  }
}
