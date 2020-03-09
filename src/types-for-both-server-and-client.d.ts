import { ChatGroup, User } from './entities'
import { UserLanguageTypeFieldOptions } from './entities/UserLanguage'
import { OnlineStatusesEnum } from './entities/User'
import { ChatGroupInviteStatusOptions } from './entities/ChatGroupInviteRecipient'

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

export interface IChatGroupInviteReducerFields {
  id: string
  createdAt: Date
  language: string
  status: ChatGroupInviteStatusOptions
  senderUserId: string
  targetUserId: string
}
