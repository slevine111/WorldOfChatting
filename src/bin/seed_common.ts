import { Message, UserChatGroup } from '../entities'
import { Repository, getConnection } from 'typeorm'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'

export const NUMBER_OF_USERS_MANUALLY = <const>3
export const CHAT_GROUP_LANGUAGES = <const>[
  'Swahili',
  'French',
  'Japanese',
  'Spanish'
]

export interface IUserSubset {
  firstName: string
  lastName: string
  email: string
  password: string
  loggedIn: boolean
}

export interface IChatGroupSubset {
  language: string
  name?: string
}

export interface IUserChatGroupSubset {
  favorite: boolean
  userId: string
  chatGroupId: string
}

export interface IUserLanguageSubset {
  type: UserLanguageTypeFieldOptions
  numberOfYears?: number
  userId: string
  language: string
}

export interface IObjectOfSets {
  [key: string]: Set<string>
}

interface IMessageSubset {
  body: string
  userId: string
  chatGroupId: string
}

const isModel = (model: unknown): model is Function => {
  return (
    typeof model === 'function' &&
    [
      'ChatGroup',
      'User',
      'UserLanguage',
      'Message',
      'Language',
      'UserChatGroup'
    ].includes(model.name)
  )
}

export const returnRepository = <T>(
  model: T,
  connectionName: string
): Repository<T> => {
  if (isModel(model)) {
    return getConnection(connectionName).getRepository(model)
  } else {
    throw Error('not model')
  }
}

export const createMessages = (
  userChatGroups: UserChatGroup[],
  connectionName: string
): Promise<Message[]> => {
  const messages: IMessageSubset[] = []
  userChatGroups.forEach((userChatGroup: UserChatGroup) => {
    messages.push({
      body: 'this is the best app ever :)',
      userId: userChatGroup.userId,
      chatGroupId: userChatGroup.chatGroupId
    })
  })
  return returnRepository((Message as unknown) as Message, connectionName).save(
    messages
  )
}
