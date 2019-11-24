import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Language } from '../../entities'

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
}
