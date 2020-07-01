import { CHAT_GROUP_KEY_PREFIX } from '../../../store/common'
import { USER_KEY_PREFIX } from '../../../store/userlanguage/constants'
import { IUserLanguageReducerState } from '../../../store/userlanguage/reducer'
import { IUserChatGroupReducerState } from '../../../store/userchatgroup/reducer'
import { IUserReducerState } from '../../../store/user/helperfunctions'
import { OnlineStatuses } from '../../../../entities/User'

export const getCountsByCommonLanguages = (
  chatGroupId: string,
  userReducerState: IUserReducerState,
  userChatGroupReducerState: IUserChatGroupReducerState,
  userLangsReducerState: IUserLanguageReducerState
): {
  countByLanguage: [string, number][]
  numberUsersTotal: number
  numberUsersOnline: number
  firstUserFullName: string
} => {
  const userChatGroupIds: string[] =
    userChatGroupReducerState.subGroupings[
      `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
    ]
  let userIds: string[] = []
  for (let i = 0; i < userChatGroupIds.length; ++i) {
    userIds.push(userChatGroupReducerState.byId[userChatGroupIds[i]].userId)
  }

  let numberUsersTotal: number = userIds.length
  let numberUsersOnline: number = 0
  let firstUserFullName: string = userReducerState.byId[userIds[0]].fullName
  for (let i = 0; i < userIds.length; ++i) {
    const { onlineStatus } = userReducerState.byId[userIds[i]]
    if (onlineStatus !== OnlineStatuses.OFFLINE) {
      ++numberUsersOnline
    }
  }

  let countByLanguage: Record<string, number> = {}
  for (let i = 0; i < userIds.length; ++i) {
    const currentUserLangIds: string[] =
      userLangsReducerState.subGroupings[`${USER_KEY_PREFIX}${userIds[i]}`]
    for (let j = 0; j < currentUserLangIds.length; ++j) {
      const { language } = userLangsReducerState.byId[currentUserLangIds[j]]
      if (countByLanguage[language] === undefined) {
        countByLanguage[language] = 1
      } else {
        ++countByLanguage[language]
      }
    }
  }
  return {
    countByLanguage: Object.entries(countByLanguage).sort(
      (a, b) => b[1] - a[1]
    ),
    numberUsersOnline,
    numberUsersTotal,
    firstUserFullName,
  }
}
