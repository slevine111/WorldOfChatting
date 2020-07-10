import {
  SubGroupingFunctionType,
  ChatGroupReducerState,
} from '../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../shared/store/constants'
import { IChatGroupAPIReturn } from '../../types-for-both-server-and-client'
const {
  chatGroups: { CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY },
} = INITIAL_SUBGROUPING_KEYS

export const removeChatGroupFromUnreadGrouping: SubGroupingFunctionType<IChatGroupAPIReturn> = (
  currentData,
  updatedChatGroup
) => {
  let updatedData: ChatGroupReducerState = JSON.parse(
    JSON.stringify(currentData)
  )
  const { id: chatGroupId } = updatedChatGroup
  const currentNotSeenMessages: string[] =
    updatedData.subGroupings[CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY]
  let updatedNotSeenMessages: string[] = []
  for (let i = 0; i < currentNotSeenMessages.length; ++i) {
    if (currentNotSeenMessages[i] !== chatGroupId) {
      updatedNotSeenMessages.push(currentNotSeenMessages[i])
    } else {
      updatedNotSeenMessages = updatedNotSeenMessages.concat(
        currentNotSeenMessages.slice(i + 1)
      )
      updatedData.subGroupings[
        CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY
      ] = updatedNotSeenMessages
      break
    }
  }
  return updatedData
}
