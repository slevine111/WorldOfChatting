import {
  RequestDataSuccessConstants,
  ActionOnDataRequestFailure,
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataTransformationInput,
  IChatGroupRequestAcceptedData,
  IChatGroupRequestBase,
} from './types'

export const userLoggedOut = () => ({
  type: <const>RequestDataSuccessConstants.USER_LOGGING_OUT_REQUEST_SUCCESS,
})

export const userLoggedIn = (data: UserLoggedInDataTransformationInput) => ({
  type: <const>(
    RequestDataSuccessConstants.HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS
  ),
  chatGroups: data[0],
  userLanguages: data[1],
  users: data[2],
  userChatGroups: data[3],
  chatGroupInvites: data[4],
  notifications: data[5],
  messages: data[6],
})

export const wentToLanguagePageView = (
  data: LanguagePageDataRetrivalArrayDataTypes
) => ({
  type: <const>(
    RequestDataSuccessConstants.WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS
  ),
  userLanguages: data[0],
  users: data[1],
  language: data[2],
})

export const chatGroupRequestAccepted = (
  data: IChatGroupRequestAcceptedData
) => ({
  type: <const>(
    RequestDataSuccessConstants.CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS
  ),
  ...data,
})

export const chatGroupRequestDeclined = (data: IChatGroupRequestBase) => ({
  type: <const>(
    RequestDataSuccessConstants.CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS
  ),
  ...data,
})

export type SharedActionsTypes =
  | ReturnType<typeof userLoggedOut>
  | ReturnType<typeof userLoggedIn>
  | ReturnType<typeof wentToLanguagePageView>
  | ReturnType<typeof chatGroupRequestAccepted>
  | ReturnType<typeof chatGroupRequestDeclined>
  | ActionOnDataRequestFailure
