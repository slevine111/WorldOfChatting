import { Language, User } from '../entities'

export interface IUserCountByLanguage {
  language: string
  usersOnlineCount: number
}

export interface ILanguageWithActiveField extends Language {
  active: boolean
}
