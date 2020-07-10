import { ActionCreatorsMapObject, AnyAction } from 'redux'
import {
  IUserAndExpireTime,
  UserLoggedInDataTransformationInput,
} from './types'
import { Language } from '../../entities'

const ENTERED_SITE_REQUEST = <const>'ENTERED_SITE_REQUEST'
const ENTERED_SITE_REQUEST_SUCCESS = <const>'ENTERED_SITE_REQUEST_SUCCESS'
const gotAllLanguages = (languages: Language[]) => ({
  type: ENTERED_SITE_REQUEST_SUCCESS,
  languages,
})
export type GotAllLanguagesAR = ReturnType<typeof gotAllLanguages>

const CHECKING_IF_USER_LOGGED_IN_REQUEST = <const>(
  'CHECKING_IF_USER_LOGGED_IN_REQUEST'
)
const CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS = <const>(
  'CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS'
)
const loggedInUserFoundEnteringSite = (data: IUserAndExpireTime) => ({
  type: CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS,
  user: data.user,
  tokenExpireTime: data.expireTime,
})
export type LoggedInUserFoundEnteringSiteAR = ReturnType<
  typeof loggedInUserFoundEnteringSite
>

const GET_LOGGEDIN_USER_BASE_DATA_REQUEST = <const>(
  'GET_LOGGEDIN_USER_BASE_DATA_REQUEST'
)
const GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS = <const>(
  'GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS'
)
const userLoggedIn = (data: UserLoggedInDataTransformationInput) => ({
  type: GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS,
  chatGroups: data[0],
  userLanguages: data[1],
  users: data[2],
  userChatGroups: data[3],
  chatGroupInvites: data[4],
  notifications: data[5],
  messages: data[6],
})
export type UserLoggedInAR = ReturnType<typeof userLoggedIn>

export const REQUEST_ACTION_TYPES = <const>{
  ENTERED_SITE_REQUEST,
  CHECKING_IF_USER_LOGGED_IN_REQUEST,
  GET_LOGGEDIN_USER_BASE_DATA_REQUEST,
}

export const REQUEST_SUCCESS_ACTION_TYPES = <const>{
  ENTERED_SITE_REQUEST_SUCCESS,
  CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS,
  GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS,
}

export const actionCreators: ActionCreatorsMapObject<AnyAction> = <const>{
  gotAllLanguages,
  loggedInUserFoundEnteringSite,
  userLoggedIn,
}
