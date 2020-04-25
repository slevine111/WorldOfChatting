import { History } from 'history'
import { IWordCloudArrayObject } from './shared-types'
import {
  IUserLanguageReducerState,
  LOGGED_IN_USER_SUBGROUPING_KEY,
} from '../../store/userlanguage/reducer'
import { IChatGroupReducerState } from '../../store/chatgroup/helperfunctions'
import { IUserReducerState } from '../../store/user/reducer'
import { NO_DIRECT_CHAT_WITH_KEY } from '../../store/user/constants'

const MAX_NUMBER_MOST_SIMILAR_USERS_DISPLAY = <const>20

export const generateWordCloudArray = (
  userLanguages: IUserLanguageReducerState,
  chatGroups: IChatGroupReducerState
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
  userReducerState: IUserReducerState,
  usersChattingWithShown: boolean
): string[] => {
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
  return userIdsDisplay
}
