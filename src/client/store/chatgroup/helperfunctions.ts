import { IChatGroupAPIReturn } from '../../../types-for-both-server-and-client'
import { SubGroupingFunctionType } from '../../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../../shared/store/constants'
import { ChatGroupReducerState } from '../../shared/store/reducers/chatgroup.reducer'
const {
  chatGroups: {
    FAVORITE_CHAT_GROUPS_KEY,
    CHAT_GROUPS_WITH_MESSAGES_KEY,
    CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
    CHAT_GROUPS_NO_MESSAGES_KEY,
  },
} = INITIAL_SUBGROUPING_KEYS

export const addIdToSubgroupingsOnLogin: SubGroupingFunctionType<IChatGroupAPIReturn> = (
  currentData,
  chatGroup
) => {
  let updatedData: ChatGroupReducerState = JSON.parse(
    JSON.stringify(currentData)
  )
  const { favorite, seenLastMessage, hasMessages, id } = chatGroup
  if (favorite) {
    updatedData.subGroupings[FAVORITE_CHAT_GROUPS_KEY].push(id)
  }
  if (hasMessages) {
    updatedData.subGroupings[CHAT_GROUPS_WITH_MESSAGES_KEY].push(id)
    if (!seenLastMessage) {
      updatedData.subGroupings[CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY].push(id)
    }
  } else {
    updatedData.subGroupings[CHAT_GROUPS_NO_MESSAGES_KEY].push(id)
  }
  return updatedData
}

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
