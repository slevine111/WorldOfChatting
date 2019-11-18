import { User, Language } from '../../entities'
import { UserLanguageTypeFieldOptions } from '../../entities/UserLanguage'

export interface IUserLanguagePostDTOSubset {
  type: UserLanguageTypeFieldOptions
  numberOfYears?: number
  active?: boolean
  languageId: string
}

export interface IUserLanguagePostDTO extends IUserLanguagePostDTOSubset {
  userId: string
}
