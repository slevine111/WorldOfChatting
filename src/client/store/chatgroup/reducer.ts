import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import {
  IChatGroupReducerState,
  addIdToSubgroupingsOnLogin,
  removeChatGroupFromUnreadGrouping,
  FAVORITE_CHAT_GROUPS_KEY,
  CHAT_GROUPS_WITH_MESSAGES_KEY,
  CHAT_GROUPS_NO_MESSAGES_KEY,
  CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
} from './helperfunctions'
import { createInitialState, normalizeData } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS,
  CLICKED_ON_CHAT_GROUP_SUCCESS,
} = RequestDataSuccessConstants

export default (
  state: IChatGroupReducerState = createInitialState([
    FAVORITE_CHAT_GROUPS_KEY,
    CHAT_GROUPS_WITH_MESSAGES_KEY,
    CHAT_GROUPS_NO_MESSAGES_KEY,
    CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
  ]),
  action: SharedActionsTypes
): IChatGroupReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.chatGroups, state, {
        subGroupingFunction: addIdToSubgroupingsOnLogin,
      })
    case CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      return normalizeData(action.newChatGroup, state)
    case CLICKED_ON_CHAT_GROUP_SUCCESS:
      return normalizeData(action.updatedChatGroup, state, {
        subGroupingFunction: removeChatGroupFromUnreadGrouping,
      })
    default:
      return state
  }
}
