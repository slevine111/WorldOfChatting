import { User } from '../../../entities'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'

export interface IWordCloudArrayObject {
  text: string
  value: number
  userType: UserLanguageTypeFieldOptions
}

export interface IUsersByChatGroup {
  name: string
  language: string
  users: User[]
}
