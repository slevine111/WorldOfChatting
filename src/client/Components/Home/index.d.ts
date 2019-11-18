import { User, UserLanguage } from '../../../entities'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'

export interface IUserWithLanguageType extends User {
  type: UserLanguageTypeFieldOptions
}

interface IUsersByLanguage {
  language: string
  languageId: string
  users: IUserWithLanguageType[]
}

export interface IObjectOfUsersByLanguage {
  [key: string]: IUsersByLanguage
}

export interface ILanguageOfLoggedInUser extends UserLanguage {
  language: string
}

export interface IReturnObject {
  languagesOfLoggedInUser: ILanguageOfLoggedInUser[]
  usersByLanguageMap: IObjectOfUsersByLanguage
}
