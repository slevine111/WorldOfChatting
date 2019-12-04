import { User, UserLanguage } from '../../../entities'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'

export interface IObjectOfUsers {
  [key: string]: User
}

export interface IUserWithLanguageType extends User {
  type: UserLanguageTypeFieldOptions
}

interface IUsersByLanguage {
  language: string
  users: IUserWithLanguageType[]
}

export interface IObjectOfUsersByLanguage {
  [key: string]: IUsersByLanguage
}

interface IUserCountByLanguage {
  text: string
  value: number
  userType: UserLanguageTypeFieldOptions | null
}

export interface IObjectOfUserCountByLanguage {
  [key: string]: IUserCountByLanguage
}

export interface ILanguageOfLoggedInUser extends UserLanguage {
  language: string
}

export interface ILanguageObjects {
  languagesOfLoggedInUser: ILanguageOfLoggedInUser[]
  usersByLanguageMap: IObjectOfUsersByLanguage
  userCountByLanguageMap: IObjectOfUserCountByLanguage
  userCountByLanguage: IUserCountByLanguage[]
}

export interface IUsersByChatGroup {
  name: string
  language: string
  users: User[]
}
