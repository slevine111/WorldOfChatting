import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW
} from './types'
import { IAuthReducerUserField } from '../auth/types'
import { IChatGroupReducer, IReduxStoreUserFields } from '../../../shared-types'
import { UserChatGroup, UserLanguage } from '../../../entities'

export const logoutUserProcess = () => ({
  type: LOGOUT_USER_PROCESS
})
type LogoutUserProcessType = ReturnType<typeof logoutUserProcess>

export const userLoggedIn = (
  loggedInUserWithLanguagesArray: IAuthReducerUserField,
  chatGroups: IChatGroupReducer,
  users: IReduxStoreUserFields[],
  userChatGroups: UserChatGroup[]
) => ({
  type: USER_LOGGED_IN,
  loggedInUserWithLanguagesArray,
  chatGroups,
  users,
  userChatGroups
})
type UserLoggedInType = ReturnType<typeof userLoggedIn>

export const wentToLanguagePageView = (
  userLanguages: UserLanguage[],
  users: IReduxStoreUserFields[]
) => ({
  type: WENT_TO_LANGUAGE_PAGE_VIEW,
  userLanguages,
  users
})
type WentToLanguagePageViewType = ReturnType<typeof wentToLanguagePageView>

export type SharedActionsTypes =
  | LogoutUserProcessType
  | UserLoggedInType
  | WentToLanguagePageViewType
