import { SET_CHAT_GROUPS } from './types'
import { ChatGroup } from '../../../entities'

export const setChatGroups = (chatGroups: ChatGroup[]) => ({
  type: SET_CHAT_GROUPS,
  chatGroups
})
type SetChatGroupsType = ReturnType<typeof setChatGroups>

export type ChatGroupActionTypes = SetChatGroupsType
