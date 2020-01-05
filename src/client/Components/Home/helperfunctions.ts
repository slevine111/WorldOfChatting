import { History } from 'history'
import { UserChatGroup } from '../../../entities'
import { IUsersByChatGroup } from '../intercomponent-types'
import {
  IChatGroupReducer,
  IChatGroupWithFavoriteField,
  IReduxStoreUserFields
} from '../../../shared-types'
import { IAuthReducerUserField } from '../../store/auth/types'
import { IWordCloudArrayObject } from './shared-types'
import { groupUserChatGroups } from '../utilityfunctions'

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

export const getFavoriteChatGroupsOfUser = (
  users: IReduxStoreUserFields[],
  chatGroups: IChatGroupReducer,
  userChatGroups: UserChatGroup[]
): IUsersByChatGroup[] => {
  const { usersGrouped } = groupUserChatGroups(users, userChatGroups)
  let usersByChatGroup: IUsersByChatGroup[] = []
  const languages: string[] = Object.keys(chatGroups)
  for (let j = 0; j < languages.length; ++j) {
    const language: string = languages[j]
    const chatGroupsOfLanguage: IChatGroupWithFavoriteField[] =
      chatGroups[language]
    for (let k = 0; k < chatGroupsOfLanguage.length; ++k) {
      const { id, name, favorite } = chatGroupsOfLanguage[k]
      if (favorite) {
        usersByChatGroup.push({
          name,
          language,
          users: usersGrouped[id]!
        })
      }
    }
  }
  return usersByChatGroup
}

export const onMyLanguageClick = (
  history: History,
  selectedLang: string,
  curRecentViewedLangs: string[],
  dispatchSetViewedLangs: (langs: string[]) => void
): void => {
  const copyLangs: string[] = [...curRecentViewedLangs]
  const langsSet: Set<string> = new Set(copyLangs)
  let newRecentViewedLangs: string[] = []
  if (!langsSet.has(selectedLang)) {
    const numberLangs: number = curRecentViewedLangs.length
    if (numberLangs === 5) copyLangs.shift()
    newRecentViewedLangs = [...copyLangs, selectedLang]
  } else if (copyLangs[copyLangs.length - 1] !== selectedLang) {
    const langIndex: number = copyLangs.indexOf(selectedLang)
    newRecentViewedLangs = [
      ...copyLangs.slice(0, langIndex),
      ...copyLangs.slice(langIndex + 1),
      selectedLang
    ]
  }
  dispatchSetViewedLangs(newRecentViewedLangs)

  history.push(`/language/${selectedLang}`)
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
}

    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
    />*/
