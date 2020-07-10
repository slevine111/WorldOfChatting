import {
  UserLanguageReducerState,
  UserChatGroupReducerState,
  UserReducerState,
} from '../../store/store.types'
import {
  INITIAL_SUBGROUPING_KEYS,
  CHAT_GROUP_KEY_PREFIX,
} from '../../store/constants'
import { OnlineStatuses } from '../../../../entities/User'
const {
  userLanguages: { LOGGED_IN_USER_SUBGROUPING_KEY },
} = INITIAL_SUBGROUPING_KEYS

export const getCountsByCommonLanguages = (
  chatGroupId: string,
  userReducerState: UserReducerState,
  userChatGroupReducerState: UserChatGroupReducerState,
  userLangsReducerState: UserLanguageReducerState
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
      userLangsReducerState.subGroupings[
        `${LOGGED_IN_USER_SUBGROUPING_KEY}${userIds[i]}`
      ]
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
