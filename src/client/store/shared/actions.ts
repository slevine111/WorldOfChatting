import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  ActionRequestData,
  ActionOnApiFailure,
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataRetrivalArrayDataTypes
} from './types'

export const logoutUserProcess = () => ({
  type: LOGOUT_USER_PROCESS
})
type LogoutUserProcessType = ReturnType<typeof logoutUserProcess>

export const userLoggedIn = (
  data: UserLoggedInDataRetrivalArrayDataTypes,
  isLoading: boolean,
  error: null
) => ({
  type: USER_LOGGED_IN,
  userLangsOfLoggedInUser: data[0],
  chatGroups: data[1],
  users: data[2],
  userChatGroups: data[3],
  isLoading,
  error
})
type UserLoggedInType = ReturnType<typeof userLoggedIn>

export const wentToLanguagePageView = (
  data: LanguagePageDataRetrivalArrayDataTypes,
  isLoading: boolean,
  error: null
) => ({
  type: WENT_TO_LANGUAGE_PAGE_VIEW,
  userLanguages: data[0],
  users: data[1],
  isLoading,
  error
})
type WentToLanguagePageViewType = ReturnType<typeof wentToLanguagePageView>

export type SharedActionsTypes =
  | LogoutUserProcessType
  | UserLoggedInType
  | WentToLanguagePageViewType
  | ActionRequestData
  | ActionOnApiFailure
