import { ChatGroup, User, UserLanguage } from './entities'
import { UserLanguageTypeFieldOptions } from './entities/UserLanguage'
import { OnlineStatusesEnum } from './entities/User'
import { NotificationTypeOptions } from './entities/NotificationType'

export interface IUserLangugeWithOnlineUserCount extends UserLanguage {
  usersOnlineCount: number
}

export interface IChatGroupAPIReturn extends ChatGroup {
  favorite: boolean
  lastMessageSeenId: string
}

export interface IChatGroupReducer {
  [key: string]: IChatGroupAPIReturn[]
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
