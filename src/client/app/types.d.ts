import {
  User,
  UserChatGroup,
  UserLanguage,
  Message,
  ChatGroupInvite,
  Notification,
} from '../../entities'
import {
  IChatGroupAPIReturn,
  IReduxStoreUserFields,
} from '../../types-for-both-server-and-client'

export interface IUserAndExpireTime {
  user: User
  expireTime: number
}

export type UserLoggedInDataTransformationInput = [
  IChatGroupAPIReturn[],
  UserLanguage[],
  IReduxStoreUserFields[],
  UserChatGroup[],
  ChatGroupInvite[],
  Notification[],
  Message[]
]
