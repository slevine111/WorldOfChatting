import { LOGOUT_USER_PROCESS, USER_LOGGED_IN } from './types'
import { IAuthReducerUserField } from '../auth/types'
import { IChatGroupReducer, IUserFieldsForStore } from '../../../shared-types'
import { UserChatGroup } from '../../../entities'

export const logoutUserProcess = () => ({
  type: LOGOUT_USER_PROCESS
})
export type LogoutUserProcessType = ReturnType<typeof logoutUserProcess>

export const userLoggedIn = (
  loggedInUserWithLanguagesArray: IAuthReducerUserField,
  chatGroups: IChatGroupReducer,
  users: IUserFieldsForStore[],
  userChatGroups: UserChatGroup[]
) => ({
  type: USER_LOGGED_IN,
  loggedInUserWithLanguagesArray,
  chatGroups,
  users,
  userChatGroups
})
type UserLoggedInType = ReturnType<typeof userLoggedIn>

export type SharedActionsTypes = LogoutUserProcessType | UserLoggedInType
