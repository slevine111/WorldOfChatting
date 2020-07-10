import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  UserLoggedInAR,
} from '../../../app/actions'
import {
  ChatGroupInviteReceivedAR,
  ACTION_TYPES as SOCKET_DISPATCH_ACTION_TYPES,
} from '../middleware/socket/actions'
import {
  REQUEST_SUCCESS_ACTION_TYPES as NAVBAR_ACTION_TYPES,
  ChatGroupRequestAcceptedAR,
  ChatGroupRequestDeclinedAR,
} from '../../../Navbar/actions'
import { INormalizedReducerShape } from '../store.types'
import { ChatGroupInvite } from '../../../../entities'
import {
  createInitialState,
  normalizeData,
  deleteDataItem,
} from '../utilityfunctions'
import { chatGroupInitialState } from './chatgroup.reducer'

export type ChatGroupInviteReducerState = INormalizedReducerShape<
  ChatGroupInvite
>

export const chatGroupInviteInitialState: ChatGroupInviteReducerState = createInitialState()

type ActionReturns =
  | UserLoggedInAR
  | ChatGroupInviteReceivedAR
  | ChatGroupRequestAcceptedAR
  | ChatGroupRequestDeclinedAR

export const chatGroupInviteReducer = (
  state: ChatGroupInviteReducerState = chatGroupInviteInitialState,
  action: ActionReturns
): ChatGroupInviteReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.chatGroupInvites, state)
    case SOCKET_DISPATCH_ACTION_TYPES.CHAT_GROUP_INVITE_RECEIVED:
      return normalizeData(action.chatGroupInviteReducerItem, state)
    case NAVBAR_ACTION_TYPES.CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
    case NAVBAR_ACTION_TYPES.CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS:
      return deleteDataItem(action.chatGroupInviteId, state)
    default:
      return state
  }
}
