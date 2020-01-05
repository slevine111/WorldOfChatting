import { LOGOUT_USER_PROCESS, USER_LOGGED_IN } from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IChatGroupReducer } from '../../../shared-types'

export default (
  state: IChatGroupReducer = {},
  action: SharedActionsTypes
): IChatGroupReducer => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return {}
    case USER_LOGGED_IN:
      return action.chatGroups
    default:
      return state
  }
}
