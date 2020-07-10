import { History } from 'history'
import { IWordCloudArrayObject } from './shared-types'
import {
  ChatGroupReducerState,
  UserReducerState,
  UserLanguageReducerState,
  UserChatGroupReducerState,
} from '../shared/store/store.types'
import {
  CHAT_GROUP_KEY_PREFIX,
  INITIAL_SUBGROUPING_KEYS,
} from '../shared/store/constants'
const {
  userLanguages: { LOGGED_IN_USER_SUBGROUPING_KEY },
  users: { NO_DIRECT_CHAT_WITH_KEY },
} = INITIAL_SUBGROUPING_KEYS

const MAX_NUMBER_MOST_SIMILAR_USERS_DISPLAY = <const>20

export const generateWordCloudArray = (
  userLanguages: UserLanguageReducerState,
  chatGroups: ChatGroupReducerState
): IWordCloudArrayObject[] => {
  let wordCloudArray: IWordCloudArrayObject[] = []
  const { subGroupings, byId } = userLanguages
  const selectedUserLangsId: string[] =
    subGroupings[LOGGED_IN_USER_SUBGROUPING_KEY]
  const chatGroupsByLanguage = chatGroups.subGroupings
  for (let i = 0; i < selectedUserLangsId.length; ++i) {
    const { language, type } = byId[selectedUserLangsId[i]]
    wordCloudArray.push({
      text: language,
      value: Array.isArray(chatGroupsByLanguage[language])
        ? chatGroupsByLanguage[language].length
        : 0,
      userType: type,
    })
  }
  return wordCloudArray
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
      selectedLang,
    ]
  }
  dispatchSetViewedLangs(newRecentViewedLangs)

  history.push(`/language/${selectedLang}`)
}

export const getMostSimilarUsers = (
  userReducerState: UserReducerState,
  allChatGroupIds: string[],
  userChatGroupReducerState: UserChatGroupReducerState,
  usersChattingWithShown: boolean
): {
  userToChatGroupMap: Record<string, string>
  userIdsDisplay: string[]
} => {
  const {
    byId: usersById,
    allIds: usersAllIds,
    subGroupings: userIdsSubGroupings,
  } = userReducerState
  let userIdsDisplay: string[] = []
  let currentSimilarityScore: number = Number.POSITIVE_INFINITY
  let userIdsCurrentSimilarityScore: string[] = []
  const userIdsLoopThrough: string[] = usersChattingWithShown
    ? usersAllIds
    : userIdsSubGroupings[NO_DIRECT_CHAT_WITH_KEY]

  if (userIdsLoopThrough.length <= MAX_NUMBER_MOST_SIMILAR_USERS_DISPLAY) {
    userIdsDisplay = userIdsLoopThrough
  } else {
    for (let i = 0; i < MAX_NUMBER_MOST_SIMILAR_USERS_DISPLAY; ++i) {
      const userId: string = userIdsLoopThrough[i]
      const { similarityScore } = usersById[userId]
      if (similarityScore !== currentSimilarityScore) {
        userIdsDisplay = [...userIdsDisplay, ...userIdsCurrentSimilarityScore]
        currentSimilarityScore = similarityScore
        userIdsCurrentSimilarityScore = [userId]
      } else {
        userIdsCurrentSimilarityScore.push(userId)
      }
    }
    const { similarityScore } = usersById[
      userIdsLoopThrough[MAX_NUMBER_MOST_SIMILAR_USERS_DISPLAY]
    ]
    if (similarityScore !== currentSimilarityScore || !userIdsDisplay.length) {
      userIdsDisplay = [...userIdsDisplay, ...userIdsCurrentSimilarityScore]
    }
  }

  let userToChatGroupMap: Record<string, string> = {}
  if (usersChattingWithShown) {
    for (let i = 0; i < allChatGroupIds.length; ++i) {
      const userChatGroupIds =
        userChatGroupReducerState.subGroupings[
          `${CHAT_GROUP_KEY_PREFIX}${allChatGroupIds[i]}`
        ]
      const { userId } = userChatGroupReducerState.byId[userChatGroupIds[0]]
      if (userChatGroupIds.length === 1 && userIdsDisplay.includes(userId)) {
        userToChatGroupMap[userId] = allChatGroupIds[i]
      }
    }
  }

  return { userToChatGroupMap, userIdsDisplay }
}
