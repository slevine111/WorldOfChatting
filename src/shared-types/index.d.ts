import { Language, ChatGroup, User } from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import { OnlineStatusesEnum } from './shared-enums'

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
  fullName: string
  email: string
  password: string
  loggedIn: boolean
  loggedInAsString: keyof typeof OnlineStatusesEnum
  userChatGroupId: string
  userId: string
  chatGroupId: string
  favorite: boolean
}

export interface IUserFieldsForStore extends User {
  fullName: string
  loggedInAsString: keyof typeof OnlineStatusesEnum
}
