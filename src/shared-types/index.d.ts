import { Language } from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'

export interface IUserCountByLanguage {
  language: string
  usersOnlineCount: number
}

export interface ILanguageWithActiveAndTypeFields extends Language {
  active: boolean
  userType: UserLanguageTypeFieldOptions
}
