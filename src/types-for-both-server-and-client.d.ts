import { ChatGroup, User } from './entities'

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
