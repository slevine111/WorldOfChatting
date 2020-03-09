import {
  IReduxStoreUserFields,
  IChatGroupInviteReducerFields,
  IChatGroupAPIReturn
} from '../../../types-for-both-server-and-client'
import { UserLanguage, UserChatGroup, Notification } from '../../../entities'
import { IUserReducerState } from '../user/reducer'
import { IUserChatGroupReducerState } from '../userchatgroup/reducer'
import { AnyAction } from 'redux'

export enum RequestDataConstants {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST = 'ENTERED_SITE_LOADING_BASE_DATA_REQUEST',
  CHECKING_IF_USER_LOGGED_IN_REQUEST = 'CHECKING_IF_USER_LOGGED_IN_REQUEST',
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST = 'AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST',
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST = 'HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST',
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST = 'WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST',
  USER_LOGGING_OUT_REQUEST = 'USER_LOGGING_OUT_REQUEST',
  REFRESHING_ACCESS_TOKEN_REQUEST = 'REFRESHING_ACCESS_TOKEN_REQUEST',
  CHAT_GROUP_INVITE_REQUEST = 'CHAT_GROUP_INVITE_REQUEST',
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST = 'CHAT_GROUP_INVITE_ACCEPTED_REQUEST',
  CHAT_GROUP_INVITE_DECLINED_REQUEST = 'CHAT_GROUP_INVITE_DECLINED_REQUEST'
}

export enum RequestDataSuccessConstants {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS = 'ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS',
  CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS = 'CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS',
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS = 'AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS',
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS = 'HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS',
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS = 'WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS',
  USER_LOGGING_OUT_REQUEST_SUCCESS = 'USER_LOGGING_OUT_REQUEST_SUCCESS',
  REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS = 'REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS',
  CHAT_GROUP_INVITE_REQUEST_SUCCESS = 'CHAT_GROUP_INVITE_REQUEST_SUCCESS',
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS = 'CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS',
  CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS = 'CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS'
}

interface ActionOnDataRequestSuccess {
  type: RequestDataSuccessConstants
  [key: string]: any
}

export const TRIGGER_DATA_REQUEST = <const>'TRIGGER_DATA_REQUEST'
export type ActionOnTriggerDataRequest = {
  type: typeof TRIGGER_DATA_REQUEST
  eventTriggeringDataRequest: RequestDataConstants
}

export const DATA_REQUEST_FAILURE = <const>'DATA_REQUEST_FAILURE'
export type ActionOnDataRequestFailure = {
  type: typeof DATA_REQUEST_FAILURE
  error: IAxiosErrorData
  event: RequestDataConstants | ''
}

export type UIAPICallingActionReturns =
  | ActionOnTriggerDataRequest
  | ActionOnDataRequestSuccess
  | ActionOnDataRequestFailure
  | { type: RequestDataConstants.REFRESHING_ACCESS_TOKEN_REQUEST }

export type LanguagePageDataRetrivalArrayDataTypes = [
  UserLanguage[],
  IReduxStoreUserFields[],
  string
]

export interface IUserLoggedInDataRetrival {
  userLanguages: UserLanguage[]
  chatGroups: IChatGroupAPIReturn[]
  users: IUserReducerState
  userChatGroups: IUserChatGroupReducerState
  chatGroupInvites: IChatGroupInviteReducerFields[]
  notifications: Notification[]
}

export interface IChatGroupRequestBase {
  newNotification: Notification
  chatGroupInviteRecipientId: string
}

export interface IChatGroupRequestAcceptedData extends IChatGroupRequestBase {
  newChatGroup: IChatGroupAPIReturn
  newUserChatGroups: UserChatGroup[]
}

export interface IAxiosErrorData {
  message: string
  statusCode: number
}

export interface IThunkReturnObject<T = any> {
  requestDataActionType: RequestDataConstants
  apiCall: () => Promise<any>
  dataTransformationCall?: (apiResponseData: any) => T
  dispatchActionOnSuccess: (
    data: T,
    otherInputs?: { [key: string]: any }
  ) => AnyAction
  dispatchProps?: { [key: string]: any }
  bypassRefreshTokenMiddleware?: boolean
}
