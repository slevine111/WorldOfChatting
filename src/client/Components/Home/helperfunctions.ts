import {
  User,
  /*UserLanguage,*/ UserChatGroup,
  ChatGroup
} from '../../../entities'
import { IAuthReducerUserField } from '../../store/auth/types'
import { IUsersByChatGroup, IWordCloudArrayObject } from './index'

interface IObjectOfUserArrays {
  [key: string]: User[] | null
}

interface IObjectOfUsers {
  [key: string]: User
}

const mapUserById = (users: User[]): IObjectOfUsers => {
  let usersMap: IObjectOfUsers = {}
  for (let i = 0; i < users.length; ++i) {
    usersMap[users[i].id] = users[i]
  }
  return usersMap
}

export const getFavoriteChatGroupsOfUser = (
  loggedInUser: IAuthReducerUserField,
  users: User[],
  chatGroups: ChatGroup[],
  userChatGroups: UserChatGroup[]
): IUsersByChatGroup[] => {
  const usersMap: IObjectOfUsers = mapUserById(users)
  let objectByChatGroup: IObjectOfUserArrays = {}
  for (let i = 0; i < userChatGroups.length; ++i) {
    const { userId, chatGroupId, favorite } = userChatGroups[i]
    if (userId === loggedInUser.id && !favorite) {
      objectByChatGroup[chatGroupId] = null
    } else if (
      userId !== loggedInUser.id &&
      objectByChatGroup[chatGroupId] !== null
    ) {
      if (objectByChatGroup[chatGroupId]) {
        objectByChatGroup[chatGroupId]!.push(usersMap[userId])
      } else {
        objectByChatGroup[chatGroupId] = [usersMap[userId]]
      }
    }
  }
  let usersByChatGroup: IUsersByChatGroup[] = []
  for (let i = 0; i < chatGroups.length; ++i) {
    const { id, name, language } = chatGroups[i]
    if (objectByChatGroup[id]) {
      usersByChatGroup.push({ name, language, users: objectByChatGroup[id]! })
    }
  }
  return usersByChatGroup
}

export const generateWordCloudArray = (
  loggedInUser: IAuthReducerUserField
): IWordCloudArrayObject[] => {
  const { languages } = loggedInUser
  let wordCloudArray: IWordCloudArrayObject[] = []
  for (let i = 0; i < languages.length; ++i) {
    const { language, usersOnlineCount, userType } = languages[i]
    wordCloudArray.push({ text: language, value: usersOnlineCount, userType })
  }
  return wordCloudArray
}

/*export const groupUsersByLanguage = (
  loggedInUser: User,
  usersMap: myInterfaces.IObjectOfUsers,
  userLanguagues: UserLanguage[]
): myInterfaces.ILanguageObjects => {
  let usersByLanguageMap: myInterfaces.IObjectOfUsersByLanguage = {}
  let userCountByLanguageMap: myInterfaces.IObjectOfUserCountByLanguage = {}
  let languagesOfLoggedInUser: UserLanguage[] = []
  for (let i = 1; i < userLanguagues.length; ++i) {
    const { userId, language, type, active } = userLanguagues[i]
    if (userId === loggedInUser.id) {
      languagesOfLoggedInUser.push(userLanguagues[i])
    } else if (active) {
      const user: myInterfaces.IUserWithLanguageType = {
        ...usersMap[userId],
        type
      }
      if (usersByLanguageMap[language]) {
        usersByLanguageMap[language].users.push(user)
      } else {
        usersByLanguageMap[language] = {
          language,
          users: [user]
        }
      }
    }
    if (userCountByLanguageMap[language] && userId === loggedInUser.id) {
      userCountByLanguageMap[language].userType = type
    } else if (
      userCountByLanguageMap[language] &&
      userId !== loggedInUser.id &&
      active
    ) {
      ++userCountByLanguageMap[language].value
    } else if (!userCountByLanguageMap[language]) {
      userCountByLanguageMap[language] = {
        text: language,
        value: Number(userId !== loggedInUser.id && active),
        userType: userId === loggedInUser.id ? type : null
      }
    }
  }

  return {
    languagesOfLoggedInUser,
    usersByLanguageMap,
    userCountByLanguageMap,
    userCountByLanguage: Object.values(userCountByLanguageMap)
  }
}*/

/*export interface IObjectOfUserCountByLanguage {
  [key: string]: IUserCountByLanguage
}

export interface ILanguageOfLoggedInUser extends UserLanguage {
  language: string
}

export interface ILanguageObjects {
  languagesOfLoggedInUser: ILanguageOfLoggedInUser[]
  usersByLanguageMap: IObjectOfUsersByLanguage
  userCountByLanguageMap: IObjectOfUserCountByLanguage
  userCountByLanguage: IUserCountByLanguage[]
}*/
