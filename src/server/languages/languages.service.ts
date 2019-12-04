import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Language } from '../../entities'
import { ILanguageWithActiveAndTypeFields } from '../../shared-types'

@Injectable()
export default class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>
  ) {}

  getAll(): Promise<Language[]> {
    return this.languageRepository
      .query(`SELECT language, countries, "usersApproved", "userSubmittedId"
              FROM language`)
  }

  getLanguagesOfUser(
    userId: string
  ): Promise<ILanguageWithActiveAndTypeFields[]> {
    return this.languageRepository.query(
      `SELECT A.*, active, type AS "userType"
       FROM language A
       JOIN (SELECT language, active, type FROM user_language WHERE "userId" = $1) B ON A.language = B.language`,
      [userId]
    )
  }
}
