import {
  accessTokenRefreshed,
  userLoginAttemptSucceeded,
  loggedInUserFoundEnteringSite
} from './actions'
import { IUserAndExpireTime } from './types'
import {
  RequestDataConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import axios, { AxiosResponse } from 'axios'
const {
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST,
  CHECKING_IF_USER_LOGGED_IN_REQUEST,
  REFRESHING_ACCESS_TOKEN_REQUEST
} = RequestDataConstants
const {
  CHECKING_IF_USER_LOGGED_IN_REQUEST_FAILURE,
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE
} = RequestDataFailureConstants

export const refreshToken = (): IThunkReturnObject<number> => {
  return {
    requestDataActionType: REFRESHING_ACCESS_TOKEN_REQUEST,
    apiCall: (): Promise<AxiosResponse<number>> => {
      return axios.get('/api/auth/refreshToken')
    },
    dispatchActionOnSuccess: accessTokenRefreshed,
    apiFailureActionType: REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE,
    dispatchProps: {}
  }
}

export const loginUserProcess = (
  userEmailAndPassword: IUserSignInDTO
): IThunkReturnObject<IUserAndExpireTime> => {
  return {
    requestDataActionType: AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST,
    apiCall: (): Promise<AxiosResponse<IUserAndExpireTime>> => {
      return axios.post('/api/auth/login', userEmailAndPassword)
    },
    dispatchActionOnSuccess: userLoginAttemptSucceeded,
    apiFailureActionType: AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE,
    dispatchProps: {}
  }
}

export const checkIfUserLoggedInProcess = (): IThunkReturnObject<IUserAndExpireTime> => {
  return {
    requestDataActionType: CHECKING_IF_USER_LOGGED_IN_REQUEST,
    apiCall: (): Promise<AxiosResponse<IUserAndExpireTime>> => {
      return axios.get('/api/auth')
    },
    dispatchActionOnSuccess: loggedInUserFoundEnteringSite,
    apiFailureActionType: CHECKING_IF_USER_LOGGED_IN_REQUEST_FAILURE,
    dispatchProps: {}
  }
}
