import {
  ChatGroup,
  User,
  UserLanguage,
  UserChatGroup,
  Notification,
  NotificationRecipient
} from '../entities'
import { UserLanguageTypeFieldOptions } from '../entities/UserLanguage'
import { NotificationTypeOptions } from '../entities/NotificationType'
import { NtRecipientStatusOptions } from '../entities/NotificationRecipient'
import seedManualData from './seed_manual'
import {
  CHAT_GROUP_LANGUAGES_MANUALLY,
  IUserSubset,
  IChatGroupSubset,
  IUserChatGroupSubset,
  IUserLanguageSubset,
  INotificationSubset,
  INotificationRecipientSubset,
  IObjectOfSets,
  ILanguageSubset,
  ICountriesByLanguageObject,
  returnRepository,
  createMessages
} from './seed_common'
import scrapeAndProcessLanguageData, {
  ICountryAndLanguage
} from './languages_scraper'
import { Connection, createConnection } from 'typeorm'
import { hash } from 'bcrypt'
import { name, internet, lorem } from 'faker'

interface IFirstAndLastName {
  firstName: string
  lastName: string
}

interface IObjectOfStrings {
  [key: string]: string
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
      lastName: name.lastName()
    })
  }
  const otherHashedPasswords: string[] = await Promise.all(
    otherUserNames.map(un => hash(`${un.firstName}${un.lastName}`, 5))
  )
  for (let i = 0; i < numberOfRandomUsers; ++i) {
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

export const createChatGroups = (
  connectionName: string
): Promise<ChatGroup[]> => {
  let chatGroupsArray: IChatGroupSubset[] = []
  const languages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'Turkish'
  ]
  for (let i = 0; i < 120 - CHAT_GROUP_LANGUAGES_MANUALLY.length; ++i) {
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
        ...randomUsers.slice(otherUsersIndex, otherUsersIndex + numberUsers)
      ]
      otherUsersIndex = otherUsersIndex + numberUsers
    }
    for (let j = 0; j < currentUsers.length; ++j) {
      userChatGroupsArray.push({
        favorite,
        userId: currentUsers[j].id,
        chatGroupId: randomChatGroups[i].id
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
  manualUsers: User[],
  allUserChatGroups: UserChatGroup[],
  allChatGroups: ChatGroup[],
  languagesByUser: IObjectOfSets,
  connectionName: string
): Promise<UserLanguage[]> => {
  let userLanguagesArray: IUserLanguageSubset[] = []

  let chatGroupLanguageMap: IObjectOfStrings = {}
  for (let k = 0; k < allChatGroups.length; ++k) {
    chatGroupLanguageMap[allChatGroups[k].id] = allChatGroups[k].language
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

  let selectedLanguages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'English',
    'Mandarin',
    'Turkish'
  ]
  for (let k = 0; k < manualUsers.length; ++k) {
    const { id } = manualUsers[k]
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

const pause = (numberSeconds: number): void => {
  const dt: number = new Date().getTime()
  while (new Date().getTime() - dt <= numberSeconds * 1000) {}
}

const createNotiifcations = async (
  randomUsers: User[],
  connectionName: string
): Promise<Notification[][]> => {
  let notificationsArrayFirst: INotificationSubset[] = []
  let notificationsArraySecond: INotificationSubset[] = []
  let notificationsArrayThird: INotificationSubset[] = []
  const { CHAT_GROUP_INVITE } = NotificationTypeOptions
  for (let i = 0; i < 9; ++i) {
    const nt: INotificationSubset = {
      notificationType: CHAT_GROUP_INVITE,
      senderId: randomUsers[i].id
    }
    if (i < 3) notificationsArrayFirst.push(nt)
    else if (i < 6) notificationsArraySecond.push(nt)
    else notificationsArrayThird.push(nt)
  }
  const ntRepo = await returnRepository(
    (Notification as unknown) as Notification,
    connectionName
  )
  const ntsFirst: Notification[] = await ntRepo.save(notificationsArrayFirst)
  pause(5)
  const ntsSecond: Notification[] = await ntRepo.save(notificationsArraySecond)
  pause(5)
  const ntsThird = await ntRepo.save(notificationsArrayThird)
  return [ntsFirst, ntsSecond, ntsThird]
}

const createNotiifcationRecipients = (
  manualUsers: User[],
  notifications: Notification[][],
  connectionName: string
): Promise<NotificationRecipient[]> => {
  let ntRecipentsArray: INotificationRecipientSubset[] = []
  const { UNREAD, ACCEPTED, DECLINED } = NtRecipientStatusOptions
  for (let i = 0; i < notifications.length; ++i) {
    const curNtsBatch: Notification[] = notifications[i]
    for (let j = 0; j < curNtsBatch.length; ++j) {
      ntRecipentsArray.push({
        status: i === 0 ? UNREAD : i === 1 ? ACCEPTED : DECLINED,
        notificationId: curNtsBatch[j].id,
        targetUserId: manualUsers[j].id
      })
    }
  }
  return returnRepository(
    (NotificationRecipient as unknown) as NotificationRecipient,
    connectionName
  ).save(ntRecipentsArray)
}

const refreshDbWithSeedData = async (): Promise<void> => {
  try {
    const {
      users,
      chatGroups,
      userChatGroups,
      languagesByUser
    } = await seedManualData(createLanguages, 'default')
    const connection: Connection = await createConnection()
    await connection.synchronize(false)
    let { name } = connection
    const randomUsers: User[] = await createUsers(name)
    const randomChatGroups: ChatGroup[] = await createChatGroups(name)
    const {
      randomUserChatGroups,
      randomUsersArrayIndexAt
    } = await createUserChatGroups(users, randomUsers, randomChatGroups, name)
    const nts: Notification[][] = await createNotiifcations(
      randomUsers.slice(randomUsersArrayIndexAt),
      name
    )
    await createNotiifcationRecipients(users, nts, name)
    const allUserChatGroups = [...userChatGroups, ...randomUserChatGroups]
    await Promise.all([
      createUserLanguages(
        users,
        allUserChatGroups,
        [...chatGroups, ...randomChatGroups],
        languagesByUser,
        name
      ),
      createMessages(allUserChatGroups, name)
    ])
    console.log('database successfully refreshed with all seed data')
    await connection.close()
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}

refreshDbWithSeedData()
