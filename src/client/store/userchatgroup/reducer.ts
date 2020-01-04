import { SET_USER_CHAT_GROUPS } from './types'
import { UserChatGroupActionTypes } from './actions'
import { LOGOUT_USER_PROCESS } from '../common/types'
import { LogoutUserProcessType } from '../common/actions'
import { UserChatGroup } from '../../../entities'

export default (
  state: UserChatGroup[] = [],
  action: UserChatGroupActionTypes | LogoutUserProcessType
): UserChatGroup[] => {
  switch (action.type) {
    case SET_USER_CHAT_GROUPS:
      return action.userChatGroups
    case LOGOUT_USER_PROCESS:
      return []
    default:
      return state
  }
}
