import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { INormalizedReducerShape } from '../reducer.base'
import { IChatGroupAPIReturn } from '../../../types-for-both-server-and-client'
import { normalizeInitialChatGroupData } from './helperfunctions'
import { createInitialState, normalizeData } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type IChatGroupReducerState = INormalizedReducerShape<
  IChatGroupAPIReturn
>

export const FAVORITE_CHAT_GROUPS_KEY = <const>'favorites'

export default (
  state: IChatGroupReducerState = createInitialState(FAVORITE_CHAT_GROUPS_KEY),
  action: SharedActionsTypes
): IChatGroupReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeInitialChatGroupData(
        action.chatGroups,
        action.userLanguages
      )
    case CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      return normalizeData(action.newChatGroup, state, {
        subGroupingKey: action.language
      })
    default:
      return state
  }
}
