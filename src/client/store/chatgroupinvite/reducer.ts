import { CHAT_GROUP_INVITE_RECEIVED } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { INormalizedReducerShape } from '../reducer.base'
import { IChatGroupInviteReducerFields } from '../../../types-for-both-server-and-client'
import {
  createInitialState,
  normalizeData,
  deleteDataItem
} from '../utilityfunctions'
import { ChatGroupInviteActionReturns } from './actions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type IChatGroupInviteReducerState = INormalizedReducerShape<
  IChatGroupInviteReducerFields
>

export default (
  state: IChatGroupInviteReducerState = createInitialState(),
  action: SharedActionsTypes | ChatGroupInviteActionReturns
): IChatGroupInviteReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.chatGroupInvites, state)
    case CHAT_GROUP_INVITE_RECEIVED:
      return normalizeData(action.chatGroupInviteReducerItem, state)
    case CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
    case CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS:
      return deleteDataItem(action.chatGroupInviteRecipientId, state)
    default:
      return state
  }
}
