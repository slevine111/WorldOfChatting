import { ChatGroup, User } from './entities'
import { ChatGroupInviteStatusOptions } from './entities/ChatGroupInviteRecipient'

export interface IChatGroupAPIReturn extends ChatGroup {
  favorite: boolean
  seenLastMessage: boolean
  hasMessages: boolean
}

export interface IReduxStoreUserFields extends User {
  fullName: string
  directChat: boolean
  similarityScore: number
}

export interface IChatGroupInviteReducerFields {
  id: string
  createdAt: Date
  status: ChatGroupInviteStatusOptions
  senderUserId: string
  targetUserId: string
}
