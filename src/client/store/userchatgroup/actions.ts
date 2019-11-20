import { SET_USER_CHAT_GROUPS } from './types'
import { UserChatGroup } from '../../../entities'

export const setUserChatGroups = (userChatGroups: UserChatGroup[]) => ({
  type: SET_USER_CHAT_GROUPS,
  userChatGroups
})
type SetUserChatGroupsType = ReturnType<typeof setUserChatGroups>

export type UserChatGroupActionTypes = SetUserChatGroupsType
