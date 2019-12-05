import {
  SET_MY_USER_CHAT_GROUPS,
  SET_CURRENT_LANGUAGE_USER_CHAT_GROUPS,
  SET_MY_AND_CURRENT_LANGUAGE_USER_CHAT_GROUPS
} from './types'
import { UserChatGroup } from '../../../entities'

export const setMyUserChatGroups = (userChatGroups: UserChatGroup[]) => ({
  type: SET_MY_USER_CHAT_GROUPS,
  userChatGroups
})
type SetMyUserChatGroupsType = ReturnType<typeof setMyUserChatGroups>

export const setCurrentLanguageUserChatGroups = (
  userChatGroups: UserChatGroup[]
) => ({
  type: SET_CURRENT_LANGUAGE_USER_CHAT_GROUPS,
  userChatGroups
})
type SetCurrentLanguageUserChatGroupsType = ReturnType<
  typeof setCurrentLanguageUserChatGroups
>

export const setMyAndCurrentLanguageUserChatGroups = (
  myUserChatGroups: UserChatGroup[],
  cLUserChatGroups: UserChatGroup[]
) => ({
  type: SET_MY_AND_CURRENT_LANGUAGE_USER_CHAT_GROUPS,
  myUserChatGroups,
  cLUserChatGroups
})
type SetMyAndCurrentLanguageUserChatGroupsType = ReturnType<
  typeof setMyAndCurrentLanguageUserChatGroups
>

export type UserChatGroupActionTypes =
  | SetMyUserChatGroupsType
  | SetCurrentLanguageUserChatGroupsType
  | SetMyAndCurrentLanguageUserChatGroupsType
