import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  ActionRequestData,
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataRetrivalArrayDataTypes
} from './types'

export const logoutUserProcess = () => ({
  type: LOGOUT_USER_PROCESS
})
type LogoutUserProcessType = ReturnType<typeof logoutUserProcess>

export const userLoggedIn = (
  data: UserLoggedInDataRetrivalArrayDataTypes,
  isLoading: boolean
) => ({
  type: USER_LOGGED_IN,
  loggedInUserWithLanguagesArray: data[0],
  chatGroups: data[1],
  users: data[2],
  userChatGroups: data[3],
  isLoading
})
type UserLoggedInType = ReturnType<typeof userLoggedIn>

export const wentToLanguagePageView = (
  data: LanguagePageDataRetrivalArrayDataTypes,
  isLoading: boolean
) => ({
  type: WENT_TO_LANGUAGE_PAGE_VIEW,
  userLanguages: data[0],
  users: data[1],
  isLoading
})
type WentToLanguagePageViewType = ReturnType<typeof wentToLanguagePageView>

export type SharedActionsTypes =
  | LogoutUserProcessType
  | UserLoggedInType
  | WentToLanguagePageViewType
  | ActionRequestData
