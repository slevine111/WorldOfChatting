import { ChatGroup, User, UserLanguage, Message, Language } from '../entities'
import scrapeAndProcessLanguageData, {
  ICountryAndLanguage
} from './languages-scraper'
import { getConnection, Connection } from 'typeorm'

interface IUserSubset {
  firstName: string
  lastName: string
  email: string
  password: string
  loggedIn: boolean
}

interface ILanguageSubset {
  language: string
  countries?: string[]
  usersApproved?: string[]
  userSubmitted?: string[]
}

interface IChatGroupSubset {
  language: Language
  name?: string
  users: User[]
}

interface IUserLanguageSubset {
  type: string
  numberOfYears?: number
  user: User
  language: Language
}

interface IMessageSubset {
  body: string
  user: User
  chatGroup: ChatGroup
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

const returnRepository = (
  model: any,
  connectionName: string = 'default'
): any => {
  return getConnection(connectionName).getRepository(model)
}

export function createUsers(
  connectionName: string = 'default'
): Promise<User[]> {
  const usersArray: IUserSubset[] = [
    {
      firstName: 'Joe',
      lastName: 'Roberts',
      email: 'jroberts@gmail.com',
      password: '12345',
      loggedIn: true
    },
    {
      firstName: 'Kim',
      lastName: 'Levine',
      email: 'klevine@gmail.com',
      password: '1234',
      loggedIn: true
    },
    {
      firstName: 'Mike',
      lastName: 'Anderson',
      email: 'manderson@gmail.com',
      password: '123',
      loggedIn: false
    }
  ]

  return returnRepository(User, connectionName).save(usersArray)
}

const createLanguages = async (): Promise<Language[]> => {
  const scrapedData: ICountryAndLanguage[] = await scrapeAndProcessLanguageData()
  const languagesAsObject: object = scrapedData.reduce(
    (acc: any, el: ICountryAndLanguage) => {
      const languageFound = acc[el.language]
      if (languageFound) {
        acc[el.language].countries.push(el.country)
      } else {
        acc[el.language] = { language: el.language, countries: [el.country] }
      }
      return acc
    },
    {}
  )
  const languages: ILanguageSubset = (Object.values(
    languagesAsObject
  ) as unknown) as ICountryAndLanguage
  return returnRepository(Language).save(languages)
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

export function createChatGroups(
  users: User[],
  languages: ISelectedLanguages,
  connectionName: string = 'default'
): Promise<ChatGroup[]> {
  let chatGroupsArray: IChatGroupSubset[] = []
  const [joe, kim, mike] = users
  const languagesToUse: string[] = ['Swahili', 'French', 'Japanese', 'Spanish']
  const usersInEachGroup: User[][] = [
    users,
    [joe, kim],
    [kim, mike],
    [joe, mike]
  ]
  for (let i = 0; i < 4; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: languages[languagesToUse[i]],
      users: usersInEachGroup[i]
    }
    if (i == 0) createdChatGroup.name = "Mama Alice's Gang"
    if (i == 3) createdChatGroup.name = 'Vamos a la playa'
    chatGroupsArray.push(createdChatGroup)
  }
  return returnRepository(ChatGroup, connectionName).save(chatGroupsArray)
}

export function createUserLanguages(
  users: User[],
  languages: ISelectedLanguages,
  connectionName: string = 'default'
): Promise<UserLanguage[]> {
  let userLanguagesArray: IUserLanguageSubset[] = []
  const {
    Swahili,
    French,
    Japanese,
    Spanish,
    English,
    Mandarin,
    Turkish
  } = languages
  const languagesArray: Language[][] = [
    [English, Swahili, Spanish, French],
    [French, Swahili, Mandarin, Japanese],
    [Japanese, Turkish, Spanish, Swahili]
  ]
  for (let i = 0; i < users.length; ++i) {
    const currentUser: User = users[i]
    for (let j = 0; j < 4; j++) {
      let createdUserLanguage: IUserLanguageSubset = {
        type: j <= 2 ? 'learner' : 'teacher',
        language: languagesArray[i][j],
        user: currentUser
      }
      if (Math.random() <= 0.5) {
        createdUserLanguage.numberOfYears = 1
      }
      userLanguagesArray.push(createdUserLanguage)
    }
  }
  return returnRepository(UserLanguage, connectionName).save(userLanguagesArray)
}

export function createMessages(
  chatGroups: ChatGroup[],
  connectionName: string = 'default'
): Promise<Message[]> {
  const messages: IMessageSubset[] = []
  chatGroups.forEach((chatGroup: ChatGroup) => {
    chatGroup.users.forEach((user: User) => {
      messages.push({
        body: 'this is the best app ever :)',
        user,
        chatGroup
      })
    })
  })

  return returnRepository(Message, connectionName).save(messages)
}

export default async (connection: Connection): Promise<void> => {
  try {
    await connection.synchronize(true)
    const users: User[] = await createUsers()
    const languages: Language[] = await createLanguages()
    const selectedLanguages: ISelectedLanguages = getSelectedLanguages(
      languages
    )
    const chatGroups: ChatGroup[] = await createChatGroups(
      users,
      selectedLanguages
    )

    await Promise.all([
      createUserLanguages(users, selectedLanguages),
      createMessages(chatGroups)
    ])
    console.log('database successfully refreshed with seed data')
    return connection.close()
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}
