import { User, UserChatGroup, UserLanguage } from '../../../entities'
import { IUsersByChatGroup, IObjectOfOneType } from '../intercomponent-types'
import { groupUserChatGroups } from '../utilityfunctions'
import {
  IChatGroupReducer,
  IChatGroupWithFavoriteField
} from '../../../shared-types'
import {
  IUserWithLanguageFields,
  LanguageTypesCombos,
  IUsersofLanguageInformation
} from './shared-types'
import {
  ILanguageExpanded,
  IAuthReducerUserField
} from '../../store/auth/types'

export const getUsersOfLanguageInformation = (
  users: User[],
  chatGroups: IChatGroupReducer,
  userChatGroups: UserChatGroup[],
  language: string
): IUsersofLanguageInformation => {
  const { usersGrouped, usersMap } = groupUserChatGroups(users, userChatGroups)
  let usersByChatGroup: IUsersByChatGroup[] = []
  const chatGroupsOfLanguage: IChatGroupWithFavoriteField[] =
    chatGroups[language]
  let userIdsOfSoloChats: IObjectOfOneType<true> = {}
  if (!Array.isArray(chatGroupsOfLanguage)) {
    return { usersByChatGroup, usersMap, userIdsOfSoloChats }
  }

  for (let k = 0; k < chatGroupsOfLanguage.length; ++k) {
    const { id, name } = chatGroupsOfLanguage[k]
    const usersOfChatGroup: User[] = usersGrouped[id]
    if (Array.isArray(usersOfChatGroup)) {
      usersByChatGroup.push({
        name,
        language,
        users: usersOfChatGroup
      })
      if (
        usersOfChatGroup[0] !== undefined &&
        usersOfChatGroup.length == 1 &&
        usersOfChatGroup[0].hasOwnProperty('id')
      ) {
        userIdsOfSoloChats[usersOfChatGroup[0].id] = true
      }
    }
  }
  return { usersByChatGroup, usersMap, userIdsOfSoloChats }
}

export const getAllUsersOfLanguage = (
  language: string,
  loggedInUser: IAuthReducerUserField,
  userLanguages: UserLanguage[],
  usersMap: IObjectOfOneType<User>,
  userIdsOfSoloChats: IObjectOfOneType<true>
): IUserWithLanguageFields[] => {
  const loggedInUserLanguages: ILanguageExpanded[] = loggedInUser.languages
  let firstLetterOfAuthUserLanguageType: 'l' | 't' | '' = ''
  for (let i = 0; i < loggedInUserLanguages.length; ++i) {
    if (loggedInUserLanguages[i].language === language) {
      firstLetterOfAuthUserLanguageType = loggedInUserLanguages[i]
        .userType[0] as 'l' | 't'
      break
    }
  }
  let usersOfLanguage: IUserWithLanguageFields[] = []
  for (let j = 0; j < userLanguages.length; ++j) {
    const { userId, type } = userLanguages[j]
    if (!userIdsOfSoloChats[userId] && userId !== loggedInUser.id) {
      if (usersMap[userId] !== undefined) {
        usersOfLanguage.push({
          ...usersMap[userId],
          language,
          userType: type,
          userAndAuthUserLanguageTypes: `${type[0]}${firstLetterOfAuthUserLanguageType}` as LanguageTypesCombos
        })
      }
    }
  }
  return usersOfLanguage
}

export const generateStringFromLanguageTypeCombo = (
  selectedUser: IUserWithLanguageFields
): string => {
  const { language, userAndAuthUserLanguageTypes, firstName } = selectedUser
  if (userAndAuthUserLanguageTypes === 'll')
    return `learn and master ${language} together`
  if (userAndAuthUserLanguageTypes === 'lt')
    return `help ${firstName} become a master at ${language}`
  if (userAndAuthUserLanguageTypes === 'tl')
    return `watch as you reach ${firstName}\'s level of mastery of ${language}`
  return `become even strong masters of ${language}`
}
