import {
  ChatGroup,
  User,
  UserLanguage,
  UserChatGroup,
  Notification,
  ChatGroupInvite,
  ChatGroupInviteRecipient,
} from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import { NotificationTypes } from '../entities/Notification'
import { ChatGroupInviteStatusOptions } from '../entities/ChatGroupInviteRecipient'
import seedManualData from './seed_manual'
import {
  CHAT_GROUP_LANGUAGES_MANUALLY,
  IUserSubset,
  IChatGroupSubset,
  IUserChatGroupSubset,
  IUserLanguageSubset,
  IChatGroupInviteSubset,
  IChatGroupInviteRecipientSubset,
  INotificationSubset,
  ILanguageSubset,
  ICountriesByLanguageObject,
  returnRepository,
  createMessages,
} from './seed_common'
import scrapeAndProcessLanguageData, {
  ICountryAndLanguage,
} from './languages_scraper'
import { Connection, createConnection } from 'typeorm'
import { hash } from 'bcrypt'
import { name, internet, lorem } from 'faker'

interface IFirstAndLastName {
  firstName: string
  lastName: string
}

const createLanguages = async (): Promise<ILanguageSubset[]> => {
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
  return Object.values(languagesAsObject)
}
createLanguages.isAsync = true

export const createUsers = async (connectionName: string): Promise<User[]> => {
  let usersArray: IUserSubset[] = []
  const numberOfRandomUsers = <const>500

  let otherUserNames: IFirstAndLastName[] = []
  for (let i = 0; i < numberOfRandomUsers; ++i) {
    otherUserNames.push({
      firstName: name.firstName(),
      lastName: name.lastName(),
    })
  }
  const otherHashedPasswords: string[] = await Promise.all(
    otherUserNames.map((un) => hash(`${un.firstName}${un.lastName}`, 5))
  )
  for (let i = 0; i < numberOfRandomUsers; ++i) {
    const { firstName, lastName } = otherUserNames[i]
    usersArray.push({
      firstName,
      lastName,
      email: internet.email(firstName, lastName),
      password: otherHashedPasswords[i],
      loggedIn: Math.random() <= 0.5,
    })
  }
  return returnRepository((User as unknown) as User, connectionName).save(
    usersArray
  )
}

export const createChatGroups = (
  connectionName: string
): Promise<ChatGroup[]> => {
  let chatGroupsArray: IChatGroupSubset[] = []
  const languages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'Turkish',
  ]
  for (let i = 0; i < 120 - CHAT_GROUP_LANGUAGES_MANUALLY.length; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: languages[Math.floor(5 * Math.random())],
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

export const createUserChatGroups = async (
  manualUsers: User[],
  randomUsers: User[],
  randomChatGroups: ChatGroup[],
  connectionName: string
): Promise<{
  randomUserChatGroups: UserChatGroup[]
  randomUsersArrayIndexAt: number
}> => {
  let userChatGroupsArray: IUserChatGroupSubset[] = []
  let otherUsersIndex: number = 0
  for (let i = 0; i < randomChatGroups.length; ++i) {
    const favorite: boolean = i % 5 === 0
    let currentUsers: User[] = []
    if (i < 60 - CHAT_GROUP_LANGUAGES_MANUALLY.length) {
      currentUsers = [manualUsers[i % 3], randomUsers[i]]
    } else {
      let numberUsers: number = 3 + Math.floor(Math.random() * 3)
      currentUsers = [
        manualUsers[i % 3],
        ...randomUsers.slice(otherUsersIndex, otherUsersIndex + numberUsers),
      ]
      otherUsersIndex = otherUsersIndex + numberUsers
    }
    for (let j = 0; j < currentUsers.length; ++j) {
      userChatGroupsArray.push({
        favorite,
        userId: currentUsers[j].id,
        chatGroupId: randomChatGroups[i].id,
      })
    }
  }
  const randomUserChatGroups: UserChatGroup[] = await returnRepository(
    (UserChatGroup as unknown) as UserChatGroup,
    connectionName
  ).save(userChatGroupsArray)
  return { randomUserChatGroups, randomUsersArrayIndexAt: otherUsersIndex }
}

const createSingleUserLanguage = (
  index: number,
  language: string,
  userId: string,
  userLanguagesArray: IUserLanguageSubset[],
  languagesByUser: Record<string, Set<String>>
): IUserLanguageSubset => {
  const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
  let createdUserLanguage: IUserLanguageSubset = {
    type: index % 2 === 0 ? LEARNER : TEACHER,
    language,
    userId,
  }
  if (Math.random() <= 0.5) {
    createdUserLanguage.numberOfYears = 1
  }
  userLanguagesArray.push(createdUserLanguage)
  if (languagesByUser[userId]) languagesByUser[userId].add(language)
  else languagesByUser[userId] = new Set([language])
  return createdUserLanguage
}

export const createUserLanguages = async (
  manualUsers: User[],
  randomUserSubset: User[],
  allUserChatGroups: UserChatGroup[],
  allChatGroups: ChatGroup[],
  languagesByUser: Record<string, Set<string>>,
  connectionName: string
): Promise<IUserLanguageSubset[][][]> => {
  let userLanguagesArray: IUserLanguageSubset[] = []

  let chatGroupLanguageMap: Record<string, string> = {}
  for (let k = 0; k < allChatGroups.length; ++k) {
    const { language } = allChatGroups[k]
    if (language !== undefined) {
      chatGroupLanguageMap[allChatGroups[k].id] = language
    }
  }

  for (let k = 0; k < allUserChatGroups.length; ++k) {
    const { userId, chatGroupId } = allUserChatGroups[k]
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

  let count: number = 0
  let userLangsByUserAndLang: IUserLanguageSubset[][][] = []
  for (let k = 0; k < manualUsers.length; ++k) {
    const manualUserId: string = manualUsers[k].id
    let userLangsByUser: IUserLanguageSubset[][] = []
    const selectedLanguages: string[] = Array.from(
      languagesByUser[manualUserId]
    )
    for (let l = 0; l < 2; ++l) {
      const language: string = selectedLanguages[l]
      let userLangs: IUserLanguageSubset[] = []
      for (let m = 0; m < 8; ++m) {
        const newUserLang = createSingleUserLanguage(
          count,
          language,
          randomUserSubset[count].id,
          userLanguagesArray,
          languagesByUser
        )
        userLangs.push(newUserLang)
        ++count
      }
      userLangsByUser.push(userLangs)
    }
    userLangsByUserAndLang.push(userLangsByUser)
  }

  await returnRepository(
    (UserLanguage as unknown) as UserLanguage,
    connectionName
  ).save(userLanguagesArray)

  return userLangsByUserAndLang
}

const createChatGroupInvites = (
  manualUsers: User[],
  userLangsByUserAndLang: IUserLanguageSubset[][][],
  connectionName: string
): Promise<ChatGroupInvite[]> => {
  let chatGroupInvitesArr: IChatGroupInviteSubset[] = []
  for (let i = 0; i < userLangsByUserAndLang.length; ++i) {
    const manualUserId: string = manualUsers[i].id
    for (let l = 0; l < userLangsByUserAndLang[i].length; ++l) {
      const currentUserLangs: IUserLanguageSubset[] =
        userLangsByUserAndLang[i][l]
      const { language } = currentUserLangs[0]
      for (let j = 0; j < 6; ++j) {
        const { userId } = currentUserLangs[j]
        chatGroupInvitesArr.push({
          senderUserId:
            (l === 0 && j !== 2) || (l === 1 && j >= 2) ? userId : manualUserId,
          language,
        })
      }
    }
  }
  return returnRepository(
    (ChatGroupInvite as unknown) as ChatGroupInvite,
    connectionName
  ).save(chatGroupInvitesArr)
}

const createChatGroupInviteRecipients = (
  manualUsers: User[],
  userLangsByUserAndLang: IUserLanguageSubset[][][],
  chatGroupInvites: ChatGroupInvite[],
  connectionName: string
): Promise<ChatGroupInviteRecipient[]> => {
  const { PENDING, ACCEPTED, DECLINED } = ChatGroupInviteStatusOptions
  let cgInviteRecipientsArr: IChatGroupInviteRecipientSubset[] = []
  let count: number = 0
  for (let i = 0; i < userLangsByUserAndLang.length; ++i) {
    const manualUserId: string = manualUsers[i].id

    for (let l = 0; l < userLangsByUserAndLang[i].length; ++l) {
      const currentUserLangs: IUserLanguageSubset[] =
        userLangsByUserAndLang[i][l]
      for (let j = 0; j < 6; ++j) {
        const { userId } = currentUserLangs[j]
        cgInviteRecipientsArr.push({
          targetUserId:
            (l === 0 && j !== 2) || (l === 1 && j >= 2) ? manualUserId : userId,
          chatGroupInviteId: chatGroupInvites[count].id,
          status: j === 0 || j > 2 ? PENDING : j === 1 ? ACCEPTED : DECLINED,
        })
        ++count
      }
    }
  }
  return returnRepository(
    (ChatGroupInviteRecipient as unknown) as ChatGroupInviteRecipient,
    connectionName
  ).save(cgInviteRecipientsArr)
}

const createNotiifcations = async (
  manualUsers: User[],
  userLangsByUserAndLang: IUserLanguageSubset[][][],
  connectionName: string
): Promise<void> => {
  let notificationsArray: INotificationSubset[] = []
  const {
    CHAT_GROUP_INVITE_DECLINED,
    CHAT_GROUP_INVITE_ACCEPTED,
  } = NotificationTypes
  for (let i = 0; i < userLangsByUserAndLang.length; ++i) {
    const manualUserId: string = manualUsers[i].id

    for (let l = 0; l < userLangsByUserAndLang[i].length; ++l) {
      const currentUserLangs: IUserLanguageSubset[] =
        userLangsByUserAndLang[i][l]
      for (let j = 6; j < currentUserLangs.length; ++j) {
        const { userId } = currentUserLangs[j]

        notificationsArray.push({
          createdAt:
            j === 6
              ? new Date()
              : new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2),
          clickedOn: j === 6,
          seen: j === 6,
          notificationType:
            j === 6 ? CHAT_GROUP_INVITE_ACCEPTED : CHAT_GROUP_INVITE_DECLINED,
          sendersUserIds: [l === 0 ? userId : manualUserId],
          targetUserId: l === 0 ? manualUserId : userId,
        })
      }
    }
  }
  const ntRepo = await returnRepository(
    (Notification as unknown) as Notification,
    connectionName
  )
  await ntRepo.save(notificationsArray)
}

const refreshDbWithSeedData = async (): Promise<void> => {
  try {
    const {
      users,
      chatGroups,
      userChatGroups,
      languagesByUser,
    } = await seedManualData(createLanguages, 'default')
    const connection: Connection = await createConnection()
    await connection.synchronize(false)
    let { name } = connection
    const [randomUsers, randomChatGroups] = await Promise.all([
      createUsers(name),
      createChatGroups(name),
    ])

    const {
      randomUserChatGroups,
      randomUsersArrayIndexAt,
    } = await createUserChatGroups(users, randomUsers, randomChatGroups, name)
    const allUserChatGroups = [...userChatGroups, ...randomUserChatGroups]
    const [userLangsForChatGroupInvites] = await Promise.all([
      createUserLanguages(
        users,
        randomUsers.slice(randomUsersArrayIndexAt),
        allUserChatGroups,
        [...chatGroups, ...randomChatGroups],
        languagesByUser,
        name
      ),
      createMessages(allUserChatGroups, name),
    ])
    const [chatGroupInvites] = await Promise.all([
      createChatGroupInvites(users, userLangsForChatGroupInvites, name),
      createNotiifcations(users, userLangsForChatGroupInvites, name),
    ])
    await createChatGroupInviteRecipients(
      users,
      userLangsForChatGroupInvites,
      chatGroupInvites,
      name
    )
    console.log('database successfully refreshed with all seed data')
    await connection.close()
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}

refreshDbWithSeedData()
