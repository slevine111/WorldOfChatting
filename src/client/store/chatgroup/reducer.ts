import { SET_CHAT_GROUPS } from './types'
import { ChatGroupActionTypes } from './actions'
import { LOGOUT_USER_PROCESS, USER_LOGGED_IN } from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IChatGroupReducer } from '../../../shared-types'

export default (
  state: IChatGroupReducer = {},
  action: ChatGroupActionTypes | SharedActionsTypes
): IChatGroupReducer => {
  switch (action.type) {
    case SET_CHAT_GROUPS:
      return action.chatGroups
    case LOGOUT_USER_PROCESS:
      return {}
    case USER_LOGGED_IN:
      return action.chatGroups
    default:
      return state
  }
}
