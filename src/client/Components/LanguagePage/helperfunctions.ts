import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { OnlineStatusesEnum } from '../../../entities/User'
import {
  IUserWithLanguageFields,
  LanguageTypesCombos,
  IOnlineStatusesChecked,
  IUserLangsTypesChecked,
  IOrderDirectionAndColumn,
  IDisplayAndDataNames
} from './shared-types'
import { displayAndDataNames } from './constants'
import {
  IUserLanguageReducerState,
  LOGGED_IN_USER_SUBGROUPING_KEY
} from '../../store/userlanguage/reducer'
import { IChatGroupReducerState } from '../../store/chatgroup/helperfunctions'
import { IUserChatGroupReducerState } from '../../store/userchatgroup/reducer'
import { IUserReducerState } from '../../store/user/reducer'
import { CHAT_GROUP_KEY_PREFIX } from '../../store/userchatgroup/reducer'

export const getAllUsersOfLanguage = (
  language: string,
  loggedInUserId: string,
  userLanguages: IUserLanguageReducerState,
  chatGroups: IChatGroupReducerState,
  userChatGroups: IUserChatGroupReducerState,
  users: IUserReducerState
): IUserWithLanguageFields[] => {
  const { byId, subGroupings } = userLanguages
  const loggedInUserLangsIds: string[] =
    subGroupings[LOGGED_IN_USER_SUBGROUPING_KEY]

  if (subGroupings[language].length === 1) {
    return []
  }

  let firstLetterOfAuthUserLanguageType: 'L' | 'T' = 'L'
  for (let i = 0; i < loggedInUserLangsIds.length; ++i) {
    if (byId[loggedInUserLangsIds[i]].language === language) {
      firstLetterOfAuthUserLanguageType = byId[loggedInUserLangsIds[i]]
        .type[0] as 'L' | 'T'
      break
    }
  }

  let userIdsOfSoloChats: Set<string> = new Set()
  for (let i = 0; i < chatGroups.subGroupings[language].length; ++i) {
    const chatGroupId: string = chatGroups.subGroupings[language][i]
    const userChatGroupKey: string = `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
    const userChatGroupIds: string[] =
      userChatGroups.subGroupings[userChatGroupKey]
    if (userChatGroupIds.length === 1) {
      userIdsOfSoloChats.add(userChatGroups.byId[userChatGroupIds[0]].userId)
    }
  }

  let usersOfLanguage: IUserWithLanguageFields[] = []
  const selectedLangUserLangIds: string[] = subGroupings[language]
  for (let j = 0; j < selectedLangUserLangIds.length; ++j) {
    const { userId, type } = byId[selectedLangUserLangIds[j]]
    if (userId !== loggedInUserId) {
      usersOfLanguage.push({
        ...users.byId[userId],
        language,
        inSoloChat: userIdsOfSoloChats.has(userId),
        userType: type,
        userAndAuthUserLanguageTypes: `${type[0]}${firstLetterOfAuthUserLanguageType}` as LanguageTypesCombos
      })
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
