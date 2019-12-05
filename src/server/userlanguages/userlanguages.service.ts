import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLanguage } from '../../entities'
import { IUserLanguagePostDTO } from './userlanguages.dto'
import { IUserCountByLanguage } from '../../shared-types'

@Injectable()
export default class UserLanguageService {
  constructor(
    @InjectRepository(UserLanguage)
    private readonly userLanguageRepository: Repository<UserLanguage>
  ) {}

  getUserLanguagesOfLanguage(language: string): Promise<UserLanguage[]> {
    return this.userLanguageRepository.find({ where: { language } })
  }

  getUserCountByLanguage(userId: string): Promise<IUserCountByLanguage[]> {
    return this.userLanguageRepository.query(
      `SELECT A.language, COUNT(A.id) AS "usersOnlineCount"
       FROM user_language A
       JOIN (SELECT language FROM user_language WHERE "userId" = $1) B ON A.language = B.language
       JOIN "user" C ON A."userId" = C.id
       WHERE active = true AND A."userId" != $2 AND "loggedIn" = true
       GROUP BY A.language
    `,
      Array(2).fill(userId)
    )
  }

  addNewUserLanguages(
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageRepository.save(newUserLanguages)
  }
}
