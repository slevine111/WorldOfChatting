import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLanguage } from '../../entities'
import {
  IUserLanguagePostDTO,
  IUserLanguageReturnPostDTO
} from './userlanguages.dto'

@Injectable()
export default class UserLanguageService {
  constructor(
    @InjectRepository(UserLanguage)
    private readonly userLanguageRepository: Repository<UserLanguage>
  ) {}

  addNewUserLanguages(
    newUserLanguages: IUserLanguagePostDTO[]
  ): Promise<UserLanguage[]> {
    return this.userLanguageRepository
      .save(newUserLanguages)
      .then((userLanguages: IUserLanguageReturnPostDTO[]) => {
        return userLanguages.map((ul: IUserLanguageReturnPostDTO) => {
          const { user, language, ...otherFields } = ul
          return { ...otherFields, userId: user.id, languageId: language.id }
        })
      })
  }
}
