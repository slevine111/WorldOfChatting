import { SET_CHAT_GROUPS } from './types'
import { ChatGroupActionTypes } from './actions'
import { IChatGroupReducer } from '../../../shared-types'

export default (
  state: IChatGroupReducer = {},
  action: ChatGroupActionTypes
): IChatGroupReducer => {
  switch (action.type) {
    case SET_CHAT_GROUPS:
      return action.chatGroups
    default:
      return state
  }
}
