import { SET_CHAT_GROUPS } from './types'
import { ChatGroupActionTypes } from './actions'
import { LOGOUT_USER_PROCESS } from '../common/types'
import { LogoutUserProcessType } from '../common/actions'
import { IChatGroupReducer } from '../../../shared-types'

export default (
  state: IChatGroupReducer = {},
  action: ChatGroupActionTypes | LogoutUserProcessType
): IChatGroupReducer => {
  switch (action.type) {
    case SET_CHAT_GROUPS:
      return action.chatGroups
    case LOGOUT_USER_PROCESS:
      return {}
    default:
      return state
  }
}
