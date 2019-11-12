import { SET_CHAT_GROUPS } from './types'
import { ChatGroupActionTypes } from './actions'
import { ChatGroup } from '../../../entities'

export default (
  state: ChatGroup[] = [],
  action: ChatGroupActionTypes
): ChatGroup[] => {
  switch (action.type) {
    case SET_CHAT_GROUPS:
      return action.chatGroups
    default:
      return state
  }
}
