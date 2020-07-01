import { Message, UserChatGroup, User, ChatGroup } from '../entities'
import { Repository, getConnection } from 'typeorm'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import { OnlineStatuses } from '../entities/User'
import { NotificationTypes } from '../entities/Notification'
import { ChatGroupInviteStatusOptions } from '../entities/ChatGroupInvite'
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
  languagesByUser: Record<string, Set<string>>
}

export interface IUserSubset {
  firstName: string
  lastName: string
  email: string
  password: string
  onlineStatus: OnlineStatuses
}

export interface IChatGroupSubset {
  directChat: boolean
  language?: string
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

export interface IMessageSubset {
  body: string
  userId: string
  chatGroupId: string
}

export interface IChatGroupInviteSubset {
  status: ChatGroupInviteStatusOptions
  senderId: string
  targetUserId: string
}

export interface INotificationSubset {
  clickedOn: boolean
  seen: boolean
  notificationType: NotificationTypes
  sendersUserIds: string[]
  targetUserId: string
  createdAt: Date
}

export const MANUAL_USERS_ARRAY: IUserSubset[] = [
  {
    firstName: 'Joe',
    lastName: 'Roberts',
    email: 'jroberts@gmail.com',
    password: hashSync('12345', 5),
    onlineStatus: OnlineStatuses.OFFLINE,
  },
  {
    firstName: 'Kim',
    lastName: 'Levine',
    email: 'klevine@gmail.com',
    password: hashSync('1234', 5),
    onlineStatus: OnlineStatuses.OFFLINE,
  },
  {
    firstName: 'Mike',
    lastName: 'Anderson',
    email: 'manderson@gmail.com',
    password: hashSync('123', 5),
    onlineStatus: OnlineStatuses.OFFLINE,
  },
]

export const CHAT_GROUP_LANGUAGES_MANUALLY = <const>[
  'Swahili',
  'French',
  'Japanese',
  'Spanish',
]

const isModel = (model: unknown): model is Function => {
  return (
    typeof model === 'function' &&
    [
      'ChatGroup',
      'User',
      'UserLanguage',
      'Message',
      'Language',
      'UserChatGroup',
      'Notification',
      'ChatGroupInvite',
      'ChatGroupInviteRecipient',
      'Notification',
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

export const createMessages = async (
  userChatGroups: UserChatGroup[],
  connectionName: string
): Promise<void> => {
  let messages: IMessageSubset[] = []
  let count: number = 1
  let messagesUserAndChatGroupId: { userId: string; chatGroupId: string }[] = []
  for (let i = 0; i < userChatGroups.length; ++i) {
    const numberMessages: number = 1 + Math.round(Math.random() * 9)
    for (let j = 0; j < numberMessages; ++j) {
      const { userId, chatGroupId } = userChatGroups[i]
      messagesUserAndChatGroupId.push({ userId, chatGroupId })
    }
  }
  const numberGroups: number = Math.ceil(
    messagesUserAndChatGroupId.length / 100
  )
  for (let j = 0; j < numberGroups; ++j) {
    const arrSlice = messagesUserAndChatGroupId.slice(100 * j, 100 * (j + 1))
    for (let i = 0; i < arrSlice.length; ++i) {
      const switchIndex: number =
        i + Math.floor(Math.random() * (arrSlice.length - i))
      messages.push({
        body: `this is the best app ever :) ${count}`,
        ...arrSlice[switchIndex],
      })
      arrSlice[switchIndex] = arrSlice[i]
      ++count
    }
  }

  const messageRepo = returnRepository(
    (Message as unknown) as Message,
    connectionName
  )
  await messageRepo.save(messages)
  await messageRepo.query(`
  UPDATE message
SET "createdAt" = A."newCreatedAt"
FROM
(SELECT A.id, a."createdAt" - interval '20' minute * rownum AS "newCreatedAt"
FROM message a
JOIN (SELECT id, ROW_NUMBER() OVER () as rownum FROM message) b ON a.id = b.id) A
WHERE A.id = message.id

  `)
}
