import {
  ChatGroup,
  User,
  UserLanguage,
  Message,
  Language,
  UserChatGroup
} from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import scrapeAndProcessLanguageData, {
  ICountryAndLanguage
} from './languages-scraper'
import { getConnection, Connection, Repository } from 'typeorm'
import { hash } from 'bcrypt'

interface IUserSubset {
  firstName: string
  lastName: string
  email: string
  password: string
  loggedIn: boolean
}

interface ILanguageSubset {
  language: string
  countries: string[]
  usersApproved?: string[]
  userSubmitted?: string[]
}

interface IChatGroupSubset {
  language: string
  name?: string
}

interface IUserChatGroupSubset {
  favorite: boolean
  userId: string
  chatGroupId: string
}

interface IUserLanguageSubset {
  type: UserLanguageTypeFieldOptions
  numberOfYears?: number
  userId: string
  language: string
}

interface IMessageSubset {
  body: string
  userId: string
  chatGroupId: string
}

export interface ISelectedLanguages {
  English: Language
  Swahili: Language
  French: Language
  Spanish: Language
  Japanese: Language
  Turkish: Language
  Mandarin: Language
  [key: string]: Language
}

interface ICountriesByLanguageObject {
  [key: string]: ILanguageSubset
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

const returnRepository = <T>(
  model: T,
  connectionName: string
): Repository<T> => {
  if (isModel(model)) {
    return getConnection(connectionName).getRepository(model)
  } else {
    throw Error('not model')
  }
}

export function createUsers(connectionName: string): Promise<User[]> {
  return Promise.all([hash('12345', 5), hash('1234', 5), hash('123', 5)]).then(
    (hashedPasswords: string[]) => {
      const usersArray: IUserSubset[] = [
        {
          firstName: 'Joe',
          lastName: 'Roberts',
          email: 'jroberts@gmail.com',
          password: hashedPasswords[0],
          loggedIn: false
        },
        {
          firstName: 'Kim',
          lastName: 'Levine',
          email: 'klevine@gmail.com',
          password: hashedPasswords[1],
          loggedIn: false
        },
        {
          firstName: 'Mike',
          lastName: 'Anderson',
          email: 'manderson@gmail.com',
          password: hashedPasswords[2],
          loggedIn: false
        }
      ]
      return returnRepository((User as unknown) as User, connectionName).save(
        usersArray
      )
    }
  )
}

const createLanguages = async (connectionName: string): Promise<Language[]> => {
  const scrapedData: ICountryAndLanguage[] = await scrapeAndProcessLanguageData()
  const languagesAsObject: ICountriesByLanguageObject = scrapedData.reduce(
    (acc: ICountriesByLanguageObject, el: ICountryAndLanguage) => {
      const languageFound: ILanguageSubset | undefined = acc[el.language]
      if (typeof languageFound === 'object') {
        languageFound.countries.push(el.country)
      } else {
        acc[el.language] = { language: el.language, countries: [el.country] }
      }
      return acc
    },
    {}
  )
  const languages: ILanguageSubset[] = Object.values(languagesAsObject)
  return returnRepository(
    (Language as unknown) as Language,
    connectionName
  ).save(languages)
}

export const getSelectedLanguages = (
  allLanguages: Language[]
): ISelectedLanguages => {
  let selectedLanguages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'English',
    'Mandarin',
    'Turkish'
  ]
  return selectedLanguages.reduce((acc: any, currentLanguage: string) => {
    acc[currentLanguage] = allLanguages.find(
      language => language.language === currentLanguage
    )
    return acc
  }, {})
}

export function createChatGroups(connectionName: string): Promise<ChatGroup[]> {
  let chatGroupsArray: IChatGroupSubset[] = []
  const languages: string[] = ['Swahili', 'French', 'Japanese', 'Spanish']
  for (let i = 0; i < 4; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: languages[i]
    }
    if (i == 0) createdChatGroup.name = "Mama Alice's Gang"
    if (i == 3) createdChatGroup.name = 'Vamos a la playa'
    chatGroupsArray.push(createdChatGroup)
  }
  return returnRepository(
    (ChatGroup as unknown) as ChatGroup,
    connectionName
  ).save(chatGroupsArray)
}

export function createUserChatGroups(
  users: User[],
  chatGroups: ChatGroup[],
  connectionName: string
): Promise<UserChatGroup[]> {
  let userChatGroupsArray: IUserChatGroupSubset[] = []
  const [joe, kim, mike] = users
  const usersInEachGroup: User[][] = [
    users,
    [joe, kim],
    [kim, mike],
    [joe, mike]
  ]
  for (let i = 0; i < chatGroups.length; ++i) {
    const favorite: boolean = i % 2 === 0
    const currentUsers: User[] = usersInEachGroup[i]
    for (let j = 0; j < currentUsers.length; ++j) {
      userChatGroupsArray.push({
        favorite,
        userId: currentUsers[j].id,
        chatGroupId: chatGroups[i].id
      })
    }
  }
  return returnRepository(
    (UserChatGroup as unknown) as UserChatGroup,
    connectionName
  ).save(userChatGroupsArray)
}

export function createUserLanguages(
  users: User[],
  connectionName: string
): Promise<UserLanguage[]> {
  let userLanguagesArray: IUserLanguageSubset[] = []
  const languagesArray: string[][] = [
    ['English', 'Swahili', 'Spanish', 'French'],
    ['French', 'Swahili', 'Mandarin', 'Japanese'],
    ['Japanese', 'Turkish', 'Spanish', 'Swahili']
  ]
  for (let i = 0; i < users.length; ++i) {
    const currentUser: User = users[i]
    for (let j = 0; j < 4; j++) {
      let createdUserLanguage: IUserLanguageSubset = {
        type: j <= 2 ? 'learner' : 'teacher',
        language: languagesArray[i][j],
        userId: currentUser.id
      }
      if (Math.random() <= 0.5) {
        createdUserLanguage.numberOfYears = 1
      }
      userLanguagesArray.push(createdUserLanguage)
    }
  }
  return returnRepository(
    (UserLanguage as unknown) as UserLanguage,
    connectionName
  ).save(userLanguagesArray)
}

export function createMessages(
  userChatGroups: UserChatGroup[],
  connectionName: string
): Promise<Message[]> {
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

export default async (connection: Connection): Promise<void> => {
  try {
    await connection.synchronize(true)
    const { name } = connection
    const users: User[] = await createUsers(name)
    await createLanguages(name)
    const chatGroups: ChatGroup[] = await createChatGroups(name)
    const userChatGroups: UserChatGroup[] = await createUserChatGroups(
      users,
      chatGroups,
      name
    )
    await Promise.all([
      createUserLanguages(users, name),
      createMessages(userChatGroups, name)
    ])
    console.log('database successfully refreshed with seed data')
    return connection.close()
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}
