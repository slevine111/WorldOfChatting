import {
  ChatGroup,
  User,
  UserLanguage,
  UserChatGroup,
  Message,
  CountryLanguage
} from '../server/db/entity'
import scrapeAndProcessLanguageData from './languages-scraper'
import { createConnection, getConnection, Connection } from 'typeorm'

interface IUserSubset {
  firstName: string
  lastName: string
  email: string
  password: string
  loggedIn: boolean
}

interface IUserLanguageSubset {
  type: string
  language: string
  numberOfYears?: number
  user: User
}

interface IChatGroupSubset {
  language: string
  name?: string
}

interface IUserChatGroupSubset {
  user: User
  chatGroup: ChatGroup
}

interface IMessageSubset {
  body: string
  userChatGroup: UserChatGroup
}

interface ICountryLanguageSubset {
  country: string
  language: string
  official: boolean
  usersApproved?: string[]
  userSubmitted?: User
}

const returnRepository = (model: any): any => {
  return getConnection().getRepository(model)
}

const createUsers = (): Promise<User[]> => {
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

  return returnRepository(User).save(usersArray)
}

const createChatGroups = (): Promise<ChatGroup[]> => {
  let chatGroupsArray: IChatGroupSubset[] = []
  const languages: string[] = ['swahili', 'french', 'japanese', 'spanish']
  for (let i = 0; i < 4; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: languages[i]
    }
    if (i == 0) createdChatGroup.name = "Mama Alice's Gang"
    if (i == 3) createdChatGroup.name = 'Vamos a la playa'
    chatGroupsArray.push(createdChatGroup)
  }
  return returnRepository(ChatGroup).save(chatGroupsArray)
}

const createUserLanguages = (users: User[]): Promise<UserLanguage[]> => {
  let userLanguagesArray: IUserLanguageSubset[] = []
  const languages: string[][] = [
    ['english', 'swahili', 'spanish', 'french'],
    ['french', 'swahili', 'mandarin', 'japanese'],
    ['japanese', 'turkish', 'spanish', 'swahili']
  ]
  for (let i = 0; i < users.length; ++i) {
    const currentUser: User = users[i]
    for (let j = 0; j < 4; j++) {
      let createdUserLanguage: IUserLanguageSubset = {
        type: j <= 2 ? 'learner' : 'teacher',
        language: languages[i][j],
        user: currentUser
      }
      if (Math.random() <= 0.5) {
        createdUserLanguage.numberOfYears = 1
      }
      userLanguagesArray.push(createdUserLanguage)
    }
  }
  return returnRepository(UserLanguage).save(userLanguagesArray)
}

const createUserChatGroups = (
  users: User[],
  chatGroups: ChatGroup[]
): Promise<UserChatGroup[]> => {
  const [joe, kim, mike] = users
  const [swahili, french, japanese, spanish] = chatGroups

  const userChatGroupsCG: ChatGroup[] = [
    swahili,
    swahili,
    swahili,
    french,
    french,
    japanese,
    japanese,
    spanish,
    spanish
  ]
  const userChatGroupsUser: User[] = [
    joe,
    kim,
    mike,
    joe,
    kim,
    kim,
    mike,
    joe,
    mike
  ]
  let userChatGroupsArray: IUserChatGroupSubset[] = []
  for (let i = 0; i < userChatGroupsCG.length; ++i) {
    const createdUserChatGroup: IUserChatGroupSubset = {
      user: userChatGroupsUser[i],
      chatGroup: userChatGroupsCG[i]
    }
    userChatGroupsArray.push(createdUserChatGroup)
  }
  return returnRepository(UserChatGroup).save(userChatGroupsArray)
}

const createMessages = (
  userChatGroups: UserChatGroup[]
): Promise<Message[]> => {
  const messages: IMessageSubset[] = []
  for (let i = 0; i < userChatGroups.length; ++i) {
    messages.push({
      body: 'this is the best app ever :)',
      userChatGroup: userChatGroups[i]
    })
  }

  return returnRepository(Message).save(messages)
}

const createCountryLanguages = async (): Promise<CountryLanguage[]> => {
  const scrapedData = await scrapeAndProcessLanguageData()
  const countryLanguages: ICountryLanguageSubset[] = scrapedData.map(item => ({
    ...item,
    official: true
  }))
  const repository = returnRepository(CountryLanguage)
  return repository.save(countryLanguages)
}

const refreshDBWithSeedData = async (): Promise<void> => {
  try {
    const connection: Connection = await createConnection()
    await connection.synchronize(true)
    const [users, chatGroups]: [
      User[],
      ChatGroup[],
      CountryLanguage[]
    ] = await Promise.all([
      createUsers(),
      createChatGroups(),
      createCountryLanguages()
    ])
    const userChatGroups: UserChatGroup[] = await createUserChatGroups(
      users,
      chatGroups
    )
    await Promise.all([
      createUserLanguages(users),
      createMessages(userChatGroups)
    ])
    console.log('database successfully refreshed with seed data')
    return connection.close()
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}

refreshDBWithSeedData()
