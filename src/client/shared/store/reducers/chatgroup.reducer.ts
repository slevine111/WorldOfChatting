import { INormalizedReducerShape } from '../store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../constants'
import { IChatGroupAPIReturn } from '../../../../types-for-both-server-and-client'
import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  UserLoggedInAR,
} from '../../../app/actions'
import { addChatGroupIdToSubgroupingOnLogin } from '../../../app/reducers-update-helpers'
import {
  REQUEST_SUCCESS_ACTION_TYPES as NAVBAR_ACTION_TYPES,
  ChatGroupRequestAcceptedAR,
} from '../../../Navbar/actions'
import {
  CLICKED_ON_CHAT_GROUP_REQUEST_SUCCESS,
  ChatGroupClickedOnAR,
} from '../../../ChatPage/actions'
import { removeChatGroupFromUnreadGrouping } from '../../../ChatPage/reducers-update-helpers'
import { createInitialState, normalizeData } from '../utilityfunctions'

export type ChatGroupReducerState = INormalizedReducerShape<IChatGroupAPIReturn>

export const chatGroupInitialState: ChatGroupReducerState = createInitialState(
  INITIAL_SUBGROUPING_KEYS.chatGroups
)

type ActionReturns =
  | UserLoggedInAR
  | ChatGroupRequestAcceptedAR
  | ChatGroupClickedOnAR

export const chatGroupReducer = (
  state: ChatGroupReducerState = chatGroupInitialState,
  action: ActionReturns
): ChatGroupReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.chatGroups, state, {
        subGroupingFunction: addChatGroupIdToSubgroupingOnLogin,
      })
    case NAVBAR_ACTION_TYPES.CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      return normalizeData(action.newChatGroup, state)
    case CLICKED_ON_CHAT_GROUP_REQUEST_SUCCESS:
      return normalizeData(action.updatedChatGroup, state, {
        subGroupingFunction: removeChatGroupFromUnreadGrouping,
      })
    default:
      return state
  }
}
