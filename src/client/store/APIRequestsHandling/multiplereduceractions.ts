import {
  RequestDataSuccessConstants,
  ActionOnDataRequestFailure,
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataRetrivalArrayDataTypes
} from './types'

export const userLoggedOut = () => ({
  type: <const>RequestDataSuccessConstants.USER_LOGGING_OUT_REQUEST_SUCCESS
})
type UserLoggedOutActionReturn = ReturnType<typeof userLoggedOut>

export const userLoggedIn = (data: UserLoggedInDataRetrivalArrayDataTypes) => ({
  type: <const>(
    RequestDataSuccessConstants.HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS
  ),
  userLangsOfLoggedInUser: data[0],
  chatGroups: data[1],
  users: data[2],
  userChatGroups: data[3],
  notifications: data[4]
})
type UserLoggedInType = ReturnType<typeof userLoggedIn>

export const wentToLanguagePageView = (
  data: LanguagePageDataRetrivalArrayDataTypes
) => ({
  type: <const>(
    RequestDataSuccessConstants.WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS
  ),
  userLanguages: data[0],
  users: data[1],
  language: data[2]
})
type WentToLanguagePageViewType = ReturnType<typeof wentToLanguagePageView>

export type SharedActionsTypes =
  | UserLoggedOutActionReturn
  | UserLoggedInType
  | WentToLanguagePageViewType
  | ActionOnDataRequestFailure
