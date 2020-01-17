import { accessTokenRefreshed, userLoggingInFound } from './actions'
import { IUserAndExpireTime } from './types'
import {
  RequestDataConstants,
  OnApiFailureActionTypes
} from '../APIRequestsHandling/types'
import { IThunkReturnObject, IThunkReturnObjectSubset } from '../apiMiddleware'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import axios, { AxiosResponse } from 'axios'
const {
  AUTHENTICATING_USER_REQUEST,
  CHECKING_IF_USER_LOGGED_IN_REQUEST,
  REFRESHING_ACCESS_TOKEN_REQUEST
} = RequestDataConstants
const {
  NO_USER_FOUND,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILED
} = OnApiFailureActionTypes

export const refreshToken = (): IThunkReturnObject<number> => {
  return {
    requestDataActionType: REFRESHING_ACCESS_TOKEN_REQUEST,
    apiCall: (): Promise<AxiosResponse<number>> => {
      return axios.get('/api/auth/refreshToken')
    },
    dispatchActionOnSuccess: accessTokenRefreshed,
    apiFailureActionType: REFRESHING_ACCESS_TOKEN_REQUEST_FAILED,
    dispatchProps: {}
  }
}

const authenticateUserThunkReturnObject: IThunkReturnObjectSubset<IUserAndExpireTime> = {
  requestDataActionType: AUTHENTICATING_USER_REQUEST,
  dispatchActionOnSuccess: userLoggingInFound,
  apiFailureActionType: NO_USER_FOUND,
  dispatchProps: {}
}

export const loginUserProcess = (
  userEmailAndPassword: IUserSignInDTO
): IThunkReturnObject<IUserAndExpireTime> => {
  return {
    ...authenticateUserThunkReturnObject,
    requestDataActionType: AUTHENTICATING_USER_REQUEST,
    apiCall: (): Promise<AxiosResponse<IUserAndExpireTime>> => {
      return axios.post('/api/auth/login', userEmailAndPassword)
    }
  }
}

export const checkIfUserLoggedInProcess = (): IThunkReturnObject<IUserAndExpireTime> => {
  return {
    ...authenticateUserThunkReturnObject,
    requestDataActionType: CHECKING_IF_USER_LOGGED_IN_REQUEST,
    apiCall: (): Promise<AxiosResponse<IUserAndExpireTime>> => {
      return axios.get('/api/auth')
    }
  }
}
