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
import { name, internet, lorem } from 'faker'

interface IUserSubset {
  firstName: string
  lastName: string
  email: string
  password: string
  loggedIn: boolean
}

interface IFirstAndLastName {
  firstName: string
  lastName: string
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

interface IObjectOfSets {
  [key: string]: Set<string>
}

interface IObjectOfStrings {
  [key: string]: string
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

export async function createUsers(connectionName: string): Promise<User[]> {
  const [jPass, kPass, mPass] = await Promise.all([
    hash('12345', 5),
    hash('1234', 5),
    hash('123', 5)
  ])

  let usersArray: IUserSubset[] = [
    {
      firstName: 'Joe',
      lastName: 'Roberts',
      email: 'jroberts@gmail.com',
      password: jPass,
      loggedIn: false
    },
    {
      firstName: 'Kim',
      lastName: 'Levine',
      email: 'klevine@gmail.com',
      password: kPass,
      loggedIn: false
    },
    {
      firstName: 'Mike',
      lastName: 'Anderson',
      email: 'manderson@gmail.com',
      password: mPass,
      loggedIn: false
    }
  ]

  let otherUserNames: IFirstAndLastName[] = []
  for (let i = 0; i < 300; ++i) {
    otherUserNames.push({
      firstName: name.firstName(),
      lastName: name.lastName()
    })
  }
  const otherHashedPasswords: string[] = await Promise.all(
    otherUserNames.map(un => hash(`${un.firstName}${un.lastName}`, 5))
  )
  for (let i = 0; i < 300; ++i) {
    const { firstName, lastName } = otherUserNames[i]
    usersArray.push({
      firstName,
      lastName,
      email: internet.email(firstName, lastName),
      password: otherHashedPasswords[i],
      loggedIn: Math.random() <= 0.5
    })
  }

  return returnRepository((User as unknown) as User, connectionName).save(
    usersArray
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
  const languages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'Turkish'
  ]
  for (let i = 0; i < 120; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: languages[i < 4 ? i : Math.floor(5 * Math.random())]
    }
    if (i == 0) createdChatGroup.name = "Mama Alice's Gang"
    if (i == 3) createdChatGroup.name = 'Vamos a la playa'
    if (i >= 4 && Math.random() <= 0.3)
      createdChatGroup.name = `${lorem.word()} ${lorem.word()}`
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
  const [joe, kim, mike] = users.slice(0, 3)
  const usersInEachGroup: User[][] = [
    users.slice(0, 3),
    [joe, kim],
    [kim, mike],
    [joe, mike]
  ]
  let otherUsersIndex: number = 3
  for (let i = 0; i < chatGroups.length; ++i) {
    const favorite: boolean = i % (i < 4 ? 2 : 5) === 0
    let currentUsers: User[] = []
    if (i < 4) {
      currentUsers = usersInEachGroup[i]
    } else if (i < 60) {
      currentUsers = [users[i % 3], users[i]]
    } else {
      let numberUsers: number = 3 + Math.floor(Math.random() * 3)
      currentUsers = [
        users[i % 3],
        ...users.slice(otherUsersIndex, otherUsersIndex + numberUsers)
      ]
      otherUsersIndex = otherUsersIndex + numberUsers
    }
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
  userChatGroups: UserChatGroup[],
  chatGroups: ChatGroup[],
  connectionName: string
): Promise<UserLanguage[]> {
  const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
  let userLanguagesArray: IUserLanguageSubset[] = []
  const languagesArray: string[][] = [
    ['English', 'Swahili', 'Spanish', 'French'],
    ['French', 'Swahili', 'Mandarin', 'Japanese'],
    ['Japanese', 'Turkish', 'Spanish', 'Swahili']
  ]
  let languagesByUser: IObjectOfSets = {}
  for (let i = 0; i < users.slice(0, 3).length; ++i) {
    const currentUser: User = users[i]
    for (let j = 0; j < 4; j++) {
      let createdUserLanguage: IUserLanguageSubset = {
        type: j <= 2 ? LEARNER : TEACHER,
        language: languagesArray[i][j],
        userId: currentUser.id
      }
      if (Math.random() <= 0.5) {
        createdUserLanguage.numberOfYears = 1
      }
      userLanguagesArray.push(createdUserLanguage)
      if (languagesByUser[currentUser.id])
        languagesByUser[currentUser.id].add(languagesArray[i][j])
      else languagesByUser[currentUser.id] = new Set([languagesArray[i][j]])
    }
  }

  let chatGroupLanguageMap: IObjectOfStrings = {}
  for (let k = 0; k < chatGroups.length; ++k) {
    chatGroupLanguageMap[chatGroups[k].id] = chatGroups[k].language
  }

  for (let k = 0; k < userChatGroups.length; ++k) {
    const { userId, chatGroupId } = userChatGroups[k]
    const curLanguage: string = chatGroupLanguageMap[chatGroupId]
    if (!languagesByUser[userId] || !languagesByUser[userId].has(curLanguage)) {
      let createdUserLanguage: IUserLanguageSubset = {
        type: k % 2 === 0 ? LEARNER : TEACHER,
        language: curLanguage,
        userId
      }
      if (Math.random() <= 0.5) {
        createdUserLanguage.numberOfYears = 1
      }
      userLanguagesArray.push(createdUserLanguage)
      if (languagesByUser[userId]) languagesByUser[userId].add(curLanguage)
      else languagesByUser[userId] = new Set([curLanguage])
    }
  }

  let selectedLanguages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'English',
    'Mandarin',
    'Turkish'
  ]
  for (let k = 3; k < users.length; ++k) {
    const { id } = users[k]
    for (let l = 0; l < 2; ++l) {
      const curLanguage: string =
        selectedLanguages[Math.floor(Math.random() * selectedLanguages.length)]
      if (!languagesByUser[id] || !languagesByUser[id].has(curLanguage)) {
        let createdUserLanguage: IUserLanguageSubset = {
          type: k % 2 === 0 ? LEARNER : TEACHER,
          language: curLanguage,
          userId: id
        }
        if (Math.random() <= 0.5) {
          createdUserLanguage.numberOfYears = 1
        }
        userLanguagesArray.push(createdUserLanguage)
        if (languagesByUser[id]) languagesByUser[id].add(curLanguage)
        else languagesByUser[id] = new Set([curLanguage])
      }
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
      createUserLanguages(users, userChatGroups, chatGroups, name),
      createMessages(userChatGroups, name)
    ])
    console.log('database successfully refreshed with seed data')
    return connection.close()
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}
