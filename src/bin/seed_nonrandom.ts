import { ChatGroup, User, UserLanguage, UserChatGroup } from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import {
  NUMBER_OF_USERS_MANUALLY,
  CHAT_GROUP_LANGUAGES,
  IUserSubset,
  IChatGroupSubset,
  IUserChatGroupSubset,
  IUserLanguageSubset,
  IObjectOfSets,
  returnRepository
} from './seed_common'
import { hash } from 'bcrypt'

export const createUsersManually = (): Promise<IUserSubset[]> => {
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

      if (usersArray.length !== NUMBER_OF_USERS_MANUALLY) {
        throw Error(
          `number of users created manually is not equal to value of constant NUMBER_OF_USERS_MANUALLY (${usersArray.length} != ${NUMBER_OF_USERS_MANUALLY})`
        )
      }

      return usersArray
    }
  )
}

export const createAndSaveUsersToDb = (
  connectionName: string
): Promise<User[]> => {
  return createUsersManually().then(users => {
    return returnRepository((User as unknown) as User, connectionName).save(
      users
    )
  })
}

export const createChatGroupsManually = (): IChatGroupSubset[] => {
  let chatGroupsArray: IChatGroupSubset[] = []
  for (let i = 0; i < CHAT_GROUP_LANGUAGES.length; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: CHAT_GROUP_LANGUAGES[i]
    }
    if (i == 0) createdChatGroup.name = "Mama Alice's Gang"
    if (i == 3) createdChatGroup.name = 'Vamos a la playa'
    chatGroupsArray.push(createdChatGroup)
  }
  return chatGroupsArray
}

export const createAndSaveChatGroupsToDb = (
  connectionName: string
): Promise<ChatGroup[]> => {
  return returnRepository(
    (ChatGroup as unknown) as ChatGroup,
    connectionName
  ).save(createChatGroupsManually())
}

export const createUserChatGroupsManully = (
  users: User[],
  chatGroups: ChatGroup[]
): IUserChatGroupSubset[] => {
  let userChatGroupsArray: IUserChatGroupSubset[] = []
  const [joe, kim, mike] = users
  const usersInEachGroup: User[][] = [
    users,
    [joe, kim],
    [kim, mike],
    [joe, mike]
  ]

  if (usersInEachGroup.length !== chatGroups.length) {
    throw Error(
      `length of array usersInEachGroup, which has in each index users for a chat group, is NOT equal to length of array CHAT_GROUP_LANGUAGES, which has in each index the language for the chat group at that index (${usersInEachGroup.length} != ${CHAT_GROUP_LANGUAGES.length}) `
    )
  }

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
  return userChatGroupsArray
}

export const createAndSaveUserChatGroupsToDb = (
  users: User[],
  chatGroups: ChatGroup[],
  connectionName: string
): Promise<UserChatGroup[]> => {
  return returnRepository(
    (UserChatGroup as unknown) as UserChatGroup,
    connectionName
  ).save(createUserChatGroupsManully(users, chatGroups))
}

interface IUserLanguageInterface {
  userLanguagesArray: IUserLanguageSubset[]
  languagesByUser: IObjectOfSets
}

export const createUserLanguagesManually = (
  users: User[]
): IUserLanguageInterface => {
  const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
  let userLanguagesArray: IUserLanguageSubset[] = []
  let languagesByUser: IObjectOfSets = {}

  const languagesArray: string[][] = [
    ['English', 'Swahili', 'Spanish', 'French', 'Czech'],
    ['French', 'Swahili', 'Mandarin', 'Japanese', 'Woleaian'],
    ['Japanese', 'Turkish', 'Spanish', 'Swahili', 'Dutch']
  ]

  if (languagesArray.length !== users.length) {
    throw Error(
      `length of array languageArray, which has in each index languages for user manually created at that index, is NOT equal to NUMBER_OF_USERS_MANUALLY (${languagesArray.length} != ${NUMBER_OF_USERS_MANUALLY}) `
    )
  }

  for (let i = 0; i < users.length; ++i) {
    const currentUser: User = users[i]
    for (let j = 0; j < languagesArray[i].length; j++) {
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
  return { userLanguagesArray, languagesByUser }
}

export const createAndSaveUserLanguagesToDb = (
  users: User[],
  connectionName: string
): Promise<UserLanguage[]> => {
  return returnRepository(
    (UserLanguage as unknown) as UserLanguage,
    connectionName
  ).save(createUserLanguagesManually(users).userLanguagesArray)
}

/*export default async (connection: Connection): Promise<void> => {
  try {
    await connection.synchronize(true)
    const { name } = connection
    const users: User[] = await createManullyAndSaveUsersToDb(name)
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
}*/
