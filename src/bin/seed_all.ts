import {
  ChatGroup,
  User,
  UserLanguage,
  Language,
  UserChatGroup
} from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import scrapeAndProcessLanguageData, {
  ICountryAndLanguage
} from './languages_scraper'
import {
  createUsersManually,
  createChatGroupsManually,
  createUserChatGroupsManully,
  createUserLanguagesManually
} from './seed_nonrandom'
import {
  NUMBER_OF_USERS_MANUALLY,
  CHAT_GROUP_LANGUAGES,
  IUserSubset,
  IChatGroupSubset,
  IUserChatGroupSubset,
  IUserLanguageSubset,
  IObjectOfSets,
  returnRepository,
  createMessages
} from './seed_common'
import { Connection } from 'typeorm'
import { hash } from 'bcrypt'
import { name, internet, lorem } from 'faker'

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

interface ICountriesByLanguageObject {
  [key: string]: ILanguageSubset
}

interface IObjectOfStrings {
  [key: string]: string
}

export const createUsers = async (connectionName: string): Promise<User[]> => {
  let usersArray: IUserSubset[] = await createUsersManually()

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

export const createChatGroups = (
  connectionName: string
): Promise<ChatGroup[]> => {
  let chatGroupsArray: IChatGroupSubset[] = createChatGroupsManually()
  const languages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'Turkish'
  ]
  for (let i = CHAT_GROUP_LANGUAGES.length; i < 120; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: languages[Math.floor(5 * Math.random())]
    }
    if (Math.random() <= 0.3)
      createdChatGroup.name = `${lorem.word()} ${lorem.word()}`
    chatGroupsArray.push(createdChatGroup)
  }
  return returnRepository(
    (ChatGroup as unknown) as ChatGroup,
    connectionName
  ).save(chatGroupsArray)
}

export const createUserChatGroups = (
  users: User[],
  chatGroups: ChatGroup[],
  connectionName: string
): Promise<UserChatGroup[]> => {
  let userChatGroupsArray: IUserChatGroupSubset[] = createUserChatGroupsManully(
    users.slice(0, NUMBER_OF_USERS_MANUALLY),
    chatGroups.slice(0, CHAT_GROUP_LANGUAGES.length)
  )
  let otherUsersIndex: number = NUMBER_OF_USERS_MANUALLY
  for (let i = CHAT_GROUP_LANGUAGES.length; i < chatGroups.length; ++i) {
    const favorite: boolean = i % 5 === 0
    let currentUsers: User[] = []
    if (i < 60) {
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

/////////////////////////////////////////////////////

const createSingleUserLanguage = (
  index: number,
  language: string,
  userId: string,
  userLanguagesArray: IUserLanguageSubset[],
  languagesByUser: IObjectOfSets
): void => {
  const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
  let createdUserLanguage: IUserLanguageSubset = {
    type: index % 2 === 0 ? LEARNER : TEACHER,
    language,
    userId
  }
  if (Math.random() <= 0.5) {
    createdUserLanguage.numberOfYears = 1
  }
  userLanguagesArray.push(createdUserLanguage)
  if (languagesByUser[userId]) languagesByUser[userId].add(language)
  else languagesByUser[userId] = new Set([language])
}

export const createUserLanguages = (
  users: User[],
  userChatGroups: UserChatGroup[],
  chatGroups: ChatGroup[],
  connectionName: string
): Promise<UserLanguage[]> => {
  let { userLanguagesArray, languagesByUser } = createUserLanguagesManually(
    users.slice(0, NUMBER_OF_USERS_MANUALLY)
  )

  let chatGroupLanguageMap: IObjectOfStrings = {}
  for (let k = 0; k < chatGroups.length; ++k) {
    chatGroupLanguageMap[chatGroups[k].id] = chatGroups[k].language
  }

  for (let k = 0; k < userChatGroups.length; ++k) {
    const { userId, chatGroupId } = userChatGroups[k]
    const curLanguage: string = chatGroupLanguageMap[chatGroupId]
    if (!languagesByUser[userId] || !languagesByUser[userId].has(curLanguage)) {
      createSingleUserLanguage(
        k,
        curLanguage,
        userId,
        userLanguagesArray,
        languagesByUser
      )
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
  for (let k = NUMBER_OF_USERS_MANUALLY; k < users.length; ++k) {
    const { id } = users[k]
    for (let l = 0; l < 2; ++l) {
      const curLanguage: string =
        selectedLanguages[Math.floor(Math.random() * selectedLanguages.length)]
      if (!languagesByUser[id] || !languagesByUser[id].has(curLanguage)) {
        createSingleUserLanguage(
          k,
          curLanguage,
          id,
          userLanguagesArray,
          languagesByUser
        )
      }
    }
  }

  return returnRepository(
    (UserLanguage as unknown) as UserLanguage,
    connectionName
  ).save(userLanguagesArray)
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
