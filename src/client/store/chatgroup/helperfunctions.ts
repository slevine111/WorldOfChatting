import { INormalizedReducerShape } from '../reducer.base'
import { SubGroupingFunctionType } from '../utilityfunctions'
import { IChatGroupAPIReturn } from '../../../types-for-both-server-and-client'

export type IChatGroupReducerState = INormalizedReducerShape<
  IChatGroupAPIReturn
>

export const FAVORITE_CHAT_GROUPS_KEY = <const>'favorites'
export const CHAT_GROUPS_WITH_MESSAGES_KEY = <const>'withMessages'
export const CHAT_GROUPS_NO_MESSAGES_KEY = <const>'noMessages'
export const CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY = <const>'notSeenLastMessage'

export const addIdToSubgroupingsOnLogin: SubGroupingFunctionType<IChatGroupAPIReturn> = (
  currentData,
  chatGroup
) => {
  let updatedData: IChatGroupReducerState = JSON.parse(
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
  let updatedData: IChatGroupReducerState = JSON.parse(
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
