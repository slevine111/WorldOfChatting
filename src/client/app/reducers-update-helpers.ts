import {
  SubGroupingFunctionType,
  ChatGroupReducerState,
  UserReducerState,
  NotificationReducerState,
} from '../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../shared/store/constants'
import {
  IChatGroupAPIReturn,
  IReduxStoreUserFields,
} from '../../types-for-both-server-and-client'
import { Notification } from '../../entities'
const {
  chatGroups: {
    FAVORITE_CHAT_GROUPS_KEY,
    CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
    CHAT_GROUPS_NO_MESSAGES_KEY,
    CHAT_GROUPS_WITH_MESSAGES_KEY,
  },
  users: { NO_DIRECT_CHAT_WITH_KEY },
  notifications: { NOT_SEEN },
} = INITIAL_SUBGROUPING_KEYS

export const addChatGroupIdToSubgroupingOnLogin: SubGroupingFunctionType<IChatGroupAPIReturn> = (
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

export const addAndCheckNtIdToNotSeenSubGrouping: SubGroupingFunctionType<Notification> = (
  currentData,
  notification
) => {
  const { seen, id } = notification
  let updatedData: NotificationReducerState = JSON.parse(
    JSON.stringify(currentData)
  )
  if (!seen) {
    updatedData.subGroupings[NOT_SEEN].push(id)
  }
  return updatedData
}
