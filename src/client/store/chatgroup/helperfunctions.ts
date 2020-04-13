import { INormalizedReducerShape } from '../reducer.base'
import { UserLanguage } from '../../../entities'
import { IChatGroupAPIReturn } from '../../../types-for-both-server-and-client'

export type IChatGroupReducerState = INormalizedReducerShape<
  IChatGroupAPIReturn
>

export const FAVORITE_CHAT_GROUPS_KEY = <const>'favorites'
export const CHAT_GROUPS_WITH_MESSAGES_KEY = <const>'chatGroupsWithMessages'

export const normalizeInitialChatGroupData = (
  chatGroupData: IChatGroupAPIReturn[],
  userLanguageData: UserLanguage[]
): IChatGroupReducerState => {
  let byId: Record<string, IChatGroupAPIReturn> = {}
  let allIds: string[] = []
  let subGroupings: Record<string, string[]> = {
    [FAVORITE_CHAT_GROUPS_KEY]: [],
    [CHAT_GROUPS_WITH_MESSAGES_KEY]: []
  }
  for (let i = 0; i < chatGroupData.length; ++i) {
    const { id, language, favorite, datetimeLastMessage } = chatGroupData[i]
    allIds.push(id)
    byId[id] = chatGroupData[i]
    if (subGroupings[language] !== undefined) {
      subGroupings[language].push(id)
    } else {
      subGroupings[language] = [id]
    }
    if (favorite) subGroupings[FAVORITE_CHAT_GROUPS_KEY].push(id)
    if (datetimeLastMessage !== null) {
      subGroupings[CHAT_GROUPS_WITH_MESSAGES_KEY].push(id)
    }
  }
  for (let i = 0; i < userLanguageData.length; ++i) {
    const { language } = userLanguageData[i]
    if (subGroupings[language] === undefined) {
      subGroupings[language] = []
    }
  }
  return { byId, allIds, subGroupings }
}
