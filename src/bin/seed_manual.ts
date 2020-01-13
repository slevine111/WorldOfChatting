import {
  ChatGroup,
  User,
  UserLanguage,
  UserChatGroup,
  Language
} from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import {
  MANUAL_USERS_ARRAY,
  CHAT_GROUP_LANGUAGES_MANUALLY,
  IChatGroupSubset,
  IUserChatGroupSubset,
  IUserLanguageSubset,
  IObjectOfSets,
  ILanguageSubset,
  ILanguageAndCountries,
  ISeedDataManualReturn,
  returnRepository
} from './seed_common'
import { Connection, createConnection } from 'typeorm'

const createAndSaveUsersToDb = (connectionName: string): Promise<User[]> => {
  return returnRepository((User as unknown) as User, connectionName).save(
    MANUAL_USERS_ARRAY
  )
}

const createChatGroupsManually = (): IChatGroupSubset[] => {
  let chatGroupsArray: IChatGroupSubset[] = []
  for (let i = 0; i < CHAT_GROUP_LANGUAGES_MANUALLY.length; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: CHAT_GROUP_LANGUAGES_MANUALLY[i]
    }
    if (i == 0) createdChatGroup.name = "Mama Alice's Gang"
    if (i == 3) createdChatGroup.name = 'Vamos a la playa'
    chatGroupsArray.push(createdChatGroup)
  }
  return chatGroupsArray
}

const createAndSaveChatGroupsToDb = (
  connectionName: string
): Promise<ChatGroup[]> => {
  return returnRepository(
    (ChatGroup as unknown) as ChatGroup,
    connectionName
  ).save(createChatGroupsManually())
}

const createUserChatGroupsManully = (
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
      `length of array usersInEachGroup, which has in each index users for a chat group, is NOT equal to length of array CHAT_GROUP_LANGUAGES, which has in each index the language for the chat group at that index (${usersInEachGroup.length} != ${CHAT_GROUP_LANGUAGES_MANUALLY.length}) `
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

const createAndSaveUserChatGroupsToDb = (
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

const createUserLanguagesManually = (users: User[]): IUserLanguageInterface => {
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
      `length of array languageArray, which has in each index languages for user manually created at that index, is NOT equal to NUMBER_OF_USERS_MANUALLY (${languagesArray.length} != ${users.length}) `
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

interface IULManualSaveDBReturn {
  userLanguages: UserLanguage[]
  languagesByUser: IObjectOfSets
}

const createAndSaveUserLanguagesToDb = async (
  users: User[],
  connectionName: string
): Promise<IULManualSaveDBReturn> => {
  const { userLanguagesArray, languagesByUser } = createUserLanguagesManually(
    users
  )
  const userLanguages: UserLanguage[] = await returnRepository(
    (UserLanguage as unknown) as UserLanguage,
    connectionName
  ).save(userLanguagesArray)
  return { userLanguages, languagesByUser }
}

type createLangsAsync = () => Promise<ILanguageSubset[]>
type createLangsSync = () => ILanguageAndCountries[]
const createLanguagesAsyncFunction = (
  createLangsFunc: createLangsAsync | createLangsSync
): createLangsFunc is createLangsAsync => {
  return (createLangsFunc as any).isAsync === true
}

Function

export default async (
  createLanguagesFunction: createLangsAsync | createLangsSync,
  connectionName: string
): Promise<ISeedDataManualReturn> => {
  try {
    const connection: Connection = await createConnection(connectionName)
    const { name } = connection
    await connection.synchronize(true)
    let languages: ILanguageSubset[] | ILanguageAndCountries[] = []
    if (createLanguagesAsyncFunction(createLanguagesFunction)) {
      languages = await createLanguagesFunction()
    } else {
      languages = createLanguagesFunction()
    }
    await returnRepository((Language as unknown) as Language, name).save(
      languages
    )
    const users: User[] = await createAndSaveUsersToDb(name)
    const chatGroups: ChatGroup[] = await createAndSaveChatGroupsToDb(name)
    const [userChatGroups, { languagesByUser }]: [
      UserChatGroup[],
      IULManualSaveDBReturn
    ] = await Promise.all([
      createAndSaveUserChatGroupsToDb(users, chatGroups, name),
      createAndSaveUserLanguagesToDb(users, name)
    ])
    await connection.close()
    console.log('database successfully refreshed with non-random, manual data')
    return { users, chatGroups, userChatGroups, languagesByUser }
  } catch (err) {
    console.log('seeding of non-random, manual data failed')
    console.error(err)
    throw err
  }
}
