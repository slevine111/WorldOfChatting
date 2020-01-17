import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLanguage } from '../../entities'
import { IUserLanguagePostDTO } from './userlanguages.dto'
import { IUserLangugeWithOnlineUserCount } from '../../types-for-both-server-and-client'

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

  getUserLanguagesOfUser(
    userId: string
  ): Promise<IUserLangugeWithOnlineUserCount[]> {
    return this.userLanguageRepository.query(
      `WITH online_user_count_by_language AS (
        SELECT A.language, COUNT(A.id) AS "usersOnlineCount"
        FROM user_language A
        JOIN (SELECT language FROM user_language WHERE "userId" = $1) B ON A.language = B.language
        JOIN "user" C ON A."userId" = C.id
        WHERE active = true AND A."userId" != $2 AND "loggedIn" = true
        GROUP BY A.language
      )
      SELECT A.*,
             CASE WHEN "usersOnlineCount" IS NOT NULL THEN "usersOnlineCount"
                  ELSE 0 END AS "usersOnlineCount"
      FROM user_language A
      LEFT JOIN online_user_count_by_language B ON A.language = B.language
      WHERE active = true AND A."userId" = $3
    `,
      Array(3).fill(userId)
    )
  }

  addNewUserLanguages(
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageRepository.save(newUserLanguages)
  }
}
