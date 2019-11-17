import { User, Language } from '../../entities'

export interface IUserLanguagePostDTOSubset {
  type: string
  numberOfYears?: number
  active?: boolean
  languageId: string
}

export interface IUserLanguagePostDTO extends IUserLanguagePostDTOSubset {
  userId: string
}
