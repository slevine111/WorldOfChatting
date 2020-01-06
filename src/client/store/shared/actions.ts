import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  REQUEST_DATA_API
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
  data: [UserLanguage[], IReduxStoreUserFields[]],
  isLoading: boolean
) => ({
  type: WENT_TO_LANGUAGE_PAGE_VIEW,
  userLanguages: data[0],
  users: data[1],
  isLoading
})
type WentToLanguagePageViewType = ReturnType<typeof wentToLanguagePageView>

export const requestDataAPI = () => ({ type: REQUEST_DATA_API })
type RequestDataAPIType = ReturnType<typeof requestDataAPI>

export type SharedActionsTypes =
  | LogoutUserProcessType
  | UserLoggedInType
  | WentToLanguagePageViewType
  | RequestDataAPIType
