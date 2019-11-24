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

  getUserLanguagesLinkedToUser(userId: string): Promise<UserLanguage[]> {
    return this.userLanguageRepository.query(
      `SELECT A.*
       FROM user_language A
       JOIN (SELECT language FROM user_language WHERE "userId" = $1) B ON A.language = B.language
    `,
      [userId]
    )
  }

  addNewUserLanguages(
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageRepository.save(newUserLanguages)
  }
}
