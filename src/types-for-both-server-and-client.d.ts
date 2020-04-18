import { ChatGroup, User } from './entities'
import { ChatGroupInviteStatusOptions } from './entities/ChatGroupInviteRecipient'

export interface IChatGroupAPIReturn extends ChatGroup {
  favorite: boolean
  lastMessageSeenTimeStamp: Date | null
  datetimeLastMessage: Date | null
}

export interface IReduxStoreUserFields extends User {
  fullName: string
  similarityScore: number
}

export interface IChatGroupInviteReducerFields {
  id: string
  createdAt: Date
  language: string
  status: ChatGroupInviteStatusOptions
  senderUserId: string
  targetUserId: string
}
