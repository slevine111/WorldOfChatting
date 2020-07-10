import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import { SubGroupingFunctionType } from '../../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../../shared/store/constants'
import { UserReducerState } from '../../shared/store/reducers/user.reducer'
const {
  users: { NO_DIRECT_CHAT_WITH_KEY },
} = INITIAL_SUBGROUPING_KEYS

export const addAndCheckUserIdToNoDirectChatSubGrouping: SubGroupingFunctionType<IReduxStoreUserFields> = (
  normalizedData,
  user
) => {
  let updatedNormalizedData: UserReducerState = JSON.parse(
    JSON.stringify(normalizedData)
  )
  const { id, directChat } = user
  if (!directChat) {
    updatedNormalizedData.subGroupings[NO_DIRECT_CHAT_WITH_KEY].push(id)
  }
  return updatedNormalizedData
}
