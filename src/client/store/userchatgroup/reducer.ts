import { SET_USER_CHAT_GROUPS } from './types'
import { UserChatGroupActionTypes } from './actions'
import { LOGOUT_USER_PROCESS, USER_LOGGED_IN } from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserChatGroup } from '../../../entities'

export default (
  state: UserChatGroup[] = [],
  action: UserChatGroupActionTypes | SharedActionsTypes
): UserChatGroup[] => {
  switch (action.type) {
    case SET_USER_CHAT_GROUPS:
      return action.userChatGroups
    case LOGOUT_USER_PROCESS:
      return []
    case USER_LOGGED_IN:
      return action.userChatGroups
    default:
      return state
  }
}
