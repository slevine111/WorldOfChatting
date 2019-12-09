import { SET_USER_CHAT_GROUPS } from './types'
import { UserChatGroupActionTypes } from './actions'
import { UserChatGroup } from '../../../entities'

export default (
  state: UserChatGroup[] = [],
  action: UserChatGroupActionTypes
): UserChatGroup[] => {
  switch (action.type) {
    case SET_USER_CHAT_GROUPS:
      return action.userChatGroups
    default:
      return state
  }
}
