import { SET_CHAT_GROUPS } from './types'
import { IChatGroupReducer } from '../../../shared-types'

export const setChatGroups = (chatGroups: IChatGroupReducer) => ({
  type: SET_CHAT_GROUPS,
  chatGroups
})
type SetChatGroupsType = ReturnType<typeof setChatGroups>

export type ChatGroupActionTypes = SetChatGroupsType
