import { ChatGroup, User, UserLanguage, Message, Language } from '../entities'
import scrapeAndProcessLanguageData, {
  ICountryAndLanguage
} from './languages-scraper'
import { getConnection, Connection } from 'typeorm'
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
  languageId: string
  name?: string
  userIds: User[]
}

export interface IChatGroupSeed extends IChatGroupSubset {
  id: string
}

interface IUserLanguageSubset {
  type: string
  numberOfYears?: number
  userId: string
  languageId: string
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

const returnRepository = (model: any, connectionName: string): any => {
  return getConnection(connectionName).getRepository(model)
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
      return returnRepository(User, connectionName).save(usersArray)
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
  return returnRepository(Language, connectionName).save(languages)
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
  connectionName: string
): Promise<IChatGroupSeed[]> {
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
      languageId: languages[languagesToUse[i]].id,
      userIds: usersInEachGroup[i]
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
  connectionName: string
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
        languageId: languagesArray[i][j].id,
        userId: currentUser.id
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
  chatGroups: IChatGroupSeed[],
  connectionName: string
): Promise<Message[]> {
  const messages: IMessageSubset[] = []
  chatGroups.forEach((chatGroup: IChatGroupSeed) => {
    chatGroup.userIds.forEach((user: User) => {
      messages.push({
        body: 'this is the best app ever :)',
        userId: user.id,
        chatGroupId: chatGroup.id
      })
    })
  })

  return returnRepository(Message, connectionName).save(messages)
}

export default async (connection: Connection): Promise<void> => {
  try {
    await connection.synchronize(true)
    const { name } = connection
    const users: User[] = await createUsers(name)
    const languages: Language[] = await createLanguages(name)
    const selectedLanguages: ISelectedLanguages = getSelectedLanguages(
      languages
    )
    const chatGroups: IChatGroupSeed[] = await createChatGroups(
      users,
      selectedLanguages,
      name
    )
    await Promise.all([
      createUserLanguages(users, selectedLanguages, name),
      createMessages(chatGroups, name)
    ])
    console.log('database successfully refreshed with seed data')
    return connection.close()
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}
