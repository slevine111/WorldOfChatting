import {
  IChatGroupReducer,
  IReduxStoreUserFields,
  IUserLangugeWithOnlineUserCount
} from '../../../shared-types'
import { UserLanguage, UserChatGroup } from '../../../entities'
import { AnyAction } from 'redux'
import { AxiosResponse } from 'axios'

export enum RequestDataConstants {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST = 'ENTERED_SITE_LOADING_BASE_DATA_REQUEST',
  CHECKING_IF_USER_LOGGED_IN_REQUEST = 'CHECKING_IF_USER_LOGGED_IN_REQUEST',
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST = 'AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST',
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST = 'HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST',
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST = 'WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST',
  USER_LOGGING_OUT_REQUEST = 'USER_LOGGING_OUT_REQUEST',
  REFRESHING_ACCESS_TOKEN_REQUEST = 'REFRESHING_ACCESS_TOKEN_REQUEST'
}

export enum RequestDataSuccessConstants {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS = 'ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS',
  CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS = 'CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS',
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS = 'AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS',
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS = 'HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS',
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS = 'WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS',
  USER_LOGGING_OUT_REQUEST_SUCCESS = 'USER_LOGGING_OUT_REQUEST_SUCCESS',
  REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS = 'REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS'
}

export enum RequestDataFailureConstants {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILURE = 'ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILURE',
  CHECKING_IF_USER_LOGGED_IN_REQUEST_FAILURE = 'CHECKING_IF_USER_LOGGED_IN_REQUEST_FAILURE',
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE = 'AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE',
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE = 'HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE',
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE = 'WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE',
  USER_LOGGING_OUT_REQUEST_FAILURE = 'USER_LOGGING_OUT_REQUEST_FAILURE',
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE = 'REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE'
}

export type ActionOnRequestData = {
  type: RequestDataConstants
  isLoading: true
}

export type ActionOnRequestDataFailure = {
  type: RequestDataFailureConstants
  error: IAxiosErrorData
  isLoading: false
}

export type LanguagePageDataRetrivalArrayDataTypes = [
  UserLanguage[],
  IReduxStoreUserFields[]
]

export type UserLoggedInDataRetrivalArrayDataTypes = [
  IUserLangugeWithOnlineUserCount[],
  IChatGroupReducer,
  IReduxStoreUserFields[],
  UserChatGroup[]
]

export interface IAxiosErrorData {
  message: string
  statusCode: number
}

export interface IThunkReturnObject<T = any> {
  requestDataActionType: RequestDataConstants
  apiCall: () => Promise<AxiosResponse[] | AxiosResponse>
  dataTransformationCall?: (apiResponseData: any) => T
  dispatchActionOnSuccess: (
    data: T,
    isLoading: boolean,
    error: null,
    otherInputs: { [key: string]: any }
  ) => AnyAction
  apiFailureActionType: RequestDataFailureConstants
  dispatchProps: { [key: string]: any }
  bypassRefreshTokenMiddleware?: boolean
}
