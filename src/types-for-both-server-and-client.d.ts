import { ChatGroup, User, UserLanguage } from './entities'
import { UserLanguageTypeFieldOptions } from './entities/UserLanguage'
import { OnlineStatusesEnum } from './entities/User'
import { NotificationTypeOptions } from './entities/NotificationType'

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
  lastMessageSeenId: string
}

export interface IReduxStoreUserFields extends User {
  fullName: string
  loggedInAsString: keyof typeof OnlineStatusesEnum
}

export interface INotificationReducerFields {
  id: string
  createdAt: string
  body: string
  read: boolean
  senderId: string
  notificationType: NotificationTypeOptions
}
