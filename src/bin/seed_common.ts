import { Message, UserChatGroup, User, ChatGroup } from '../entities'
import { Repository, getConnection } from 'typeorm'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import { hashSync } from 'bcrypt'

export interface ILanguageAndCountries {
  language: string
  countries: string[]
}

export interface ILanguageSubset {
  language: string
  countries: string[]
  usersApproved?: string[]
  userSubmitted?: string[]
}

export interface ICountriesByLanguageObject {
  [key: string]: ILanguageSubset
}

export interface ISeedDataManualReturn {
  users: User[]
  chatGroups: ChatGroup[]
  userChatGroups: UserChatGroup[]
  languagesByUser: IObjectOfSets
}

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

export const MANUAL_USERS_ARRAY: IUserSubset[] = [
  {
    firstName: 'Joe',
    lastName: 'Roberts',
    email: 'jroberts@gmail.com',
    password: hashSync('12345', 5),
    loggedIn: false
  },
  {
    firstName: 'Kim',
    lastName: 'Levine',
    email: 'klevine@gmail.com',
    password: hashSync('1234', 5),
    loggedIn: false
  },
  {
    firstName: 'Mike',
    lastName: 'Anderson',
    email: 'manderson@gmail.com',
    password: hashSync('123', 5),
    loggedIn: false
  }
]

export const CHAT_GROUP_LANGUAGES_MANUALLY = <const>[
  'Swahili',
  'French',
  'Japanese',
  'Spanish'
]

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
