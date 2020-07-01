import { NO_DIRECT_CHAT_WITH_KEY } from './constants'
import { SubGroupingFunctionType } from '../../store/utilityfunctions'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import { INormalizedReducerShape } from '../reducer.base'

export type IUserReducerState = INormalizedReducerShape<IReduxStoreUserFields>

export const addIdToSubGroupingFromSimilarityScore: SubGroupingFunctionType<IReduxStoreUserFields> = (
  normalizedData,
  user
) => {
  let updatedNormalizedData: IUserReducerState = JSON.parse(
    JSON.stringify(normalizedData)
  )
  const { id, directChat } = user
  if (!directChat) {
    updatedNormalizedData.subGroupings[NO_DIRECT_CHAT_WITH_KEY].push(id)
  }
  return updatedNormalizedData
}
