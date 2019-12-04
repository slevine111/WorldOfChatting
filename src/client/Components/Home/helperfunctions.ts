import { User, UserLanguage, UserChatGroup, ChatGroup } from '../../../entities'
import * as myInterfaces from './index'

interface IObjectOfUserArrays {
  [key: string]: User[] | null
}

export const mapUserById = (users: User[]): myInterfaces.IObjectOfUsers => {
  let usersMap: myInterfaces.IObjectOfUsers = {}
  for (let i = 0; i < users.length; ++i) {
    usersMap[users[i].id] = users[i]
  }
  return usersMap
}

export const getFavoriteChatGroupsOfUser = (
  loggedInUser: User,
  usersMap: myInterfaces.IObjectOfUsers,
  chatGroups: ChatGroup[],
  userChatGroups: UserChatGroup[]
): myInterfaces.IUsersByChatGroup[] => {
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
  let usersByChatGroup: myInterfaces.IUsersByChatGroup[] = []
  for (let i = 0; i < chatGroups.length; ++i) {
    const { id, name, language } = chatGroups[i]
    if (objectByChatGroup[id]) {
      usersByChatGroup.push({ name, language, users: objectByChatGroup[id]! })
    }
  }
  return usersByChatGroup
}

export const groupUsersByLanguage = (
  loggedInUser: User,
  usersMap: myInterfaces.IObjectOfUsers,
  userLanguagues: UserLanguage[]
): myInterfaces.ILanguageObjects => {
  let usersByLanguageMap: myInterfaces.IObjectOfUsersByLanguage = {}
  let userCountByLanguageMap: myInterfaces.IObjectOfUserCountByLanguage = {}
  let languagesOfLoggedInUser: UserLanguage[] = []
  for (let i = 0; i < userLanguagues.length; ++i) {
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
}
