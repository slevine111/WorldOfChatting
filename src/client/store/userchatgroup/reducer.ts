import { LOGOUT_USER_PROCESS, USER_LOGGED_IN } from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserChatGroup } from '../../../entities'

export default (
  state: UserChatGroup[] = [],
  action: SharedActionsTypes
): UserChatGroup[] => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return []
    case USER_LOGGED_IN:
      return action.userChatGroups
    default:
      return state
  }
}
