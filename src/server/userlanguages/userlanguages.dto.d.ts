import { User, Language } from '../../entities'

export interface IUserLanguagePostDTOSubset {
  type: string
  numberOfYears?: number
  active?: boolean
  language: Language
}

export interface IUserLanguagePostDTO extends IUserLanguagePostDTOSubset {
  user: User
}
