import axios, { AxiosResponse } from 'axios'
import { ACTION_TYPES, accessTokenRefreshed } from './actions'
import { IThunkReturnObject } from '../../store.types'

export const refreshToken = (): IThunkReturnObject<number> => {
  return {
    requestDataActionType: ACTION_TYPES.REFRESHING_ACCESS_TOKEN_REQUEST,
    apiCall: (): Promise<AxiosResponse<number>> => {
      return axios.get('/api/auth/refreshToken')
    },
    dispatchActionOnSuccess: accessTokenRefreshed,
  }
}
