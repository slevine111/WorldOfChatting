import { INormalizedReducerShape } from '../reducer.base'
import { UserLanguage } from '../../../entities'
import { IChatGroupAPIReturn } from '../../../types-for-both-server-and-client'

export const normalizeInitialChatGroupData = (
  chatGroupData: IChatGroupAPIReturn[],
  userLanguageData: UserLanguage[]
): INormalizedReducerShape<IChatGroupAPIReturn> => {
  let normalizedData: INormalizedReducerShape<IChatGroupAPIReturn> = {
    byId: {},
    allIds: [],
    subGroupings: { favorites: [] }
  }
  for (let i = 0; i < chatGroupData.length; ++i) {
    const { id, language, favorite } = chatGroupData[i]
    normalizedData.allIds.push(id)
    normalizedData.byId[id] = chatGroupData[i]
    if (normalizedData.subGroupings[language] !== undefined) {
      normalizedData.subGroupings[language].push(id)
    } else {
      normalizedData.subGroupings[language] = [id]
    }
    if (favorite) normalizedData.subGroupings.favorites.push(id)
  }
  for (let i = 0; i < userLanguageData.length; ++i) {
    const { language } = userLanguageData[i]
    if (normalizedData.subGroupings[language] === undefined) {
      normalizedData.subGroupings[language] = []
    }
  }
  return normalizedData
}
