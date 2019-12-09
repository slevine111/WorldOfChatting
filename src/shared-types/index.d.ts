import { Language, ChatGroup } from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'

export interface IUserCountByLanguage {
  language: string
  usersOnlineCount: number
}

export interface ILanguageWithActiveAndTypeFields extends Language {
  active: boolean
  userType: UserLanguageTypeFieldOptions
}

export interface IChatGroupWithFavoriteField extends ChatGroup {
  favorite: boolean
}

export interface IChatGroupReducer {
  [key: string]: IChatGroupWithFavoriteField[]
}

export interface IUserAndChatGroupGetReturn {
  userTableId: string
  firstName: string
  lastName: string
  email: string
  password: string
  loggedIn: boolean
  userChatGroupId: string
  userId: string
  chatGroupId: string
  favorite: boolean
}
