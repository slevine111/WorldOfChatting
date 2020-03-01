import { ChatGroup, User } from './entities'
import { UserLanguageTypeFieldOptions } from './entities/UserLanguage'
import { OnlineStatusesEnum } from './entities/User'
import { NotificationTypeOptions } from './entities/NotificationType'
import { NtRecipientStatusOptions } from './entities/NotificationRecipient'

export interface IChatGroupAPIReturn extends ChatGroup {
  favorite: boolean
  lastMessageSeenTimeStamp: string | null
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
  lastMessageSeenTimeStamp: string
}

export interface IReduxStoreUserFields extends User {
  fullName: string
  loggedInAsString: keyof typeof OnlineStatusesEnum
}

export interface INotificationReducerFields {
  id: string
  createdAt: Date
  updatedAt: Date
  status: NtRecipientStatusOptions
  senderId: string
  notificationType: NotificationTypeOptions
  targetUserId: string
}
