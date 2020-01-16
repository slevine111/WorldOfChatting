import {
  IChatGroupReducer,
  IReduxStoreUserFields,
  IUserLangugeWithOnlineUserCount
} from '../../../shared-types'
import { UserLanguage, UserChatGroup } from '../../../entities'
import { IAxiosErrorData } from '../apiMiddleware'

export const LOGOUT_USER_PROCESS = <const>'LOGOUT_USER_PROCESS'
export const USER_LOGGED_IN = <const>'USER_LOGGED_IN'
export const WENT_TO_LANGUAGE_PAGE_VIEW = <const>'WENT_TO_LANGUAGE_PAGE_VIEW'
export const ENTERED_SITE_BASE_DATA_RECEIVED = <const>(
  'ENTERED_SITE_BASE_DATA_RECEIVED'
)

export enum RequestDataConstants {
  REQUEST_DATA_API = 'REQUEST_DATA_API',
  REQUEST_DATA_USER_LOGGED_IN = 'REQUEST_DATA_USER_LOGGED_IN',
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST = 'ENTERED_SITE_LOADING_BASE_DATA_REQUEST',
  AUTHENTICATING_USER_REQUEST = 'AUTHENTICATING_USER_REQUEST',
  CHECKING_IF_USER_LOGGED_IN_REQUEST = 'CHECKING_IF_USER_LOGGED_IN_REQUEST',
  REFRESHING_ACCESS_TOKEN_REQUEST = 'REFRESHING_ACCESS_TOKEN_REQUEST',
  USER_LOGGING_OUT_REQUEST = 'USER_LOGGING_OUT_REQUEST'
}

export enum OnApiFailureActionTypes {
  NO_USER_FOUND = 'NO_USER_FOUND',
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILED = 'REFRESHING_ACCESS_TOKEN_REQUEST_FAILED',
  REQUEST_DATA_USER_LOGGED_IN_FAILED = 'REQUEST_DATA_USER_LOGGED_IN_FAILED',
  REQUEST_DATA_API_FAILED = 'REQUEST_DATA_API_FAILED',
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILED = 'ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILED',
  USER_LOGGING_OUT_REQUEST_FAILED = 'USER_LOGGING_OUT_REQUEST_FAILED'
}

export type ActionRequestData = {
  type: RequestDataConstants
  isLoading: true
}

export type ActionOnApiFailure = {
  type: OnApiFailureActionTypes
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
