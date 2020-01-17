import { ChatGroup, User, UserLanguage } from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import { OnlineStatusesEnum } from '../entities/User'

export interface IUserLangugeWithOnlineUserCount extends UserLanguage {
  usersOnlineCount: number
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

export interface IReduxStoreUserFields extends User {
  fullName: string
  loggedInAsString: keyof typeof OnlineStatusesEnum
}
