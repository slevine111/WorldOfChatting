import { UserChatGroup, UserLanguage } from '../../../entities'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IUsersByChatGroup, IObjectOfOneType } from '../intercomponent-types'
import { groupUserChatGroups } from '../utilityfunctions'
import {
  IChatGroupReducer,
  IChatGroupWithFavoriteField,
  IReduxStoreUserFields,
  IUserLangugeWithOnlineUserCount
} from '../../../types-for-both-server-and-client'
import { OnlineStatusesEnum } from '../../../entities/User'
import {
  IUserWithLanguageFields,
  LanguageTypesCombos,
  IUsersofLanguageInformation,
  IOnlineStatusesChecked,
  IUserLangsTypesChecked,
  IOrderDirectionAndColumn,
  IDisplayAndDataNames
} from './shared-types'
import { displayAndDataNames } from './constants'

export const getUsersOfLanguageInformation = (
  users: IReduxStoreUserFields[],
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
    const usersOfChatGroup = usersGrouped[id]
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
  loggedInUserId: string,
  userLoggedInLanguages: IUserLangugeWithOnlineUserCount[],
  usersNotLoggedInLanguages: UserLanguage[],
  usersMap: IObjectOfOneType<IReduxStoreUserFields>,
  userIdsOfSoloChats: IObjectOfOneType<true>
): IUserWithLanguageFields[] => {
  let firstLetterOfAuthUserLanguageType: 'L' | 'T' | '' = ''
  for (let i = 0; i < userLoggedInLanguages.length; ++i) {
    if (userLoggedInLanguages[i].language === language) {
      firstLetterOfAuthUserLanguageType = userLoggedInLanguages[i].type[0] as
        | 'L'
        | 'T'
      break
    }
  }
  let usersOfLanguage: IUserWithLanguageFields[] = []
  for (let j = 0; j < usersNotLoggedInLanguages.length; ++j) {
    const { userId, type } = usersNotLoggedInLanguages[j]
    if (!userIdsOfSoloChats[userId] && userId !== loggedInUserId) {
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
  if (userAndAuthUserLanguageTypes === 'LL')
    return `learn and master ${language} together`
  if (userAndAuthUserLanguageTypes === 'LT')
    return `help ${firstName} become a master at ${language}`
  if (userAndAuthUserLanguageTypes === 'TL')
    return `watch as you reach ${firstName}\'s level of mastery of ${language}`
  return `become even stronger masters of ${language}`
}

export const filterUsers = (
  users: IUserWithLanguageFields[],
  onlineStatusesChecked: IOnlineStatusesChecked,
  userLangsTypesChecked: IUserLangsTypesChecked,
  searchUserText: string
): IUserWithLanguageFields[] => {
  const { Online, Offline } = OnlineStatusesEnum
  const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
  if (
    onlineStatusesChecked[Online] === true &&
    onlineStatusesChecked[Offline] === true &&
    userLangsTypesChecked[LEARNER] === true &&
    userLangsTypesChecked[TEACHER] === true &&
    searchUserText === ''
  ) {
    return users
  }
  let filteredUsers: IUserWithLanguageFields[] = []
  let searchTextRegExp: RegExp = generateRegExp(searchUserText)
  for (let i = 0; i < users.length; ++i) {
    const { loggedInAsString, userType, fullName } = users[i]
    if (
      onlineStatusesChecked[loggedInAsString] === true &&
      userLangsTypesChecked[userType] === true &&
      (searchUserText === '' || searchTextRegExp.test(fullName))
    )
      filteredUsers.push(users[i])
  }
  return filteredUsers
}

const generateRegExp = (string: string): RegExp => {
  return RegExp(string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
}

export const getUsersToDisplayFromFilteredUsers = (
  users: IUserWithLanguageFields[],
  currentPage: number,
  rowsPerPage: number,
  orderDirectionAndColumn: IOrderDirectionAndColumn
): IUserWithLanguageFields[] => {
  const { orderColumn, orderDirection } = orderDirectionAndColumn
  return users
    .sort((a, b) => {
      const firstItemValue: string = a[orderColumn] as string
      const secondItemValue: string = b[orderColumn] as string
      return (
        (orderDirection === 'asc' ? 1 : -1) *
        firstItemValue.localeCompare(secondItemValue)
      )
    })
    .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
}

export const generateOrderByOptionsIconDisplay = (): IDisplayAndDataNames[] => {
  let returnArr: IDisplayAndDataNames[] = []
  for (let i = 0; i < displayAndDataNames.length; ++i) {
    returnArr.push({ ...displayAndDataNames[i], orderDirection: 'asc' })
    returnArr.push({ ...displayAndDataNames[i], orderDirection: 'desc' })
  }
  return returnArr
}
