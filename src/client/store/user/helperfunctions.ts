import { NO_DIRECT_CHAT_WITH_KEY } from './constants'
import { SubGroupingFunctionType } from '../../store/utilityfunctions'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'

export const addIdToSubGroupingFromSimilarityScore: SubGroupingFunctionType<IReduxStoreUserFields> = (
  subGroupings,
  user
) => {
  let updatedSubGroupings: Record<string, string[]> = JSON.parse(
    JSON.stringify(subGroupings)
  )
  const { id, directChat } = user
  if (!directChat) {
    updatedSubGroupings[NO_DIRECT_CHAT_WITH_KEY].push(id)
  }
  return updatedSubGroupings
}
