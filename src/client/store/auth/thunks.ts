import { accessTokenRefreshed, userLoggingInFound } from './actions'
import { IUserAndExpireTime } from './types'
import { RequestDataConstants } from '../shared/types'
import { IThunkReturnObject, IThunkReturnObjectSubset } from '../apiMiddleware'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import axios, { AxiosResponse } from 'axios'
const {
  AUTHENTICATING_USER_REQUEST,
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

const authenticateUserThunkReturnObject: IThunkReturnObjectSubset<IUserAndExpireTime> = {
  requestDataActionType: AUTHENTICATING_USER_REQUEST,
  dispatchActionOnSuccess: userLoggingInFound,
  dispatchProps: {}
}

export const loginUserProcess = (
  userEmailAndPassword: IUserSignInDTO
): IThunkReturnObject<IUserAndExpireTime> => {
  return {
    ...authenticateUserThunkReturnObject,
    apiCall: (): Promise<AxiosResponse<IUserAndExpireTime>> => {
      return axios.post('/api/auth/login', userEmailAndPassword)
    }
  }
}

export const checkIfUserLoggedInProcess = (): IThunkReturnObject<IUserAndExpireTime> => {
  return {
    ...authenticateUserThunkReturnObject,
    apiCall: (): Promise<AxiosResponse<IUserAndExpireTime>> => {
      return axios.get('/api/auth')
    }
  }
}
