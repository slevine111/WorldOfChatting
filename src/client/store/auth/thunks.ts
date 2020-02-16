import {
  accessTokenRefreshed,
  userLoginAttemptSucceeded,
  loggedInUserFoundEnteringSite
} from './actions'
import { IUserAndExpireTime } from './types'
import { RequestDataConstants } from '../APIRequestsHandling/types'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import axios, { AxiosResponse } from 'axios'
const {
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST,
  CHECKING_IF_USER_LOGGED_IN_REQUEST,
  REFRESHING_ACCESS_TOKEN_REQUEST
} = RequestDataConstants

export const refreshToken = (): IThunkReturnObject<number> => {
  return {
    requestDataActionType: REFRESHING_ACCESS_TOKEN_REQUEST,
    apiCall: (): Promise<AxiosResponse<number>> => {
      return axios.get('/api/auth/refreshToken')
    },
    dispatchActionOnSuccess: accessTokenRefreshed,
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
    dispatchProps: {}
  }
}
