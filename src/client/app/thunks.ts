import axios, { AxiosResponse } from 'axios'
import { REQUEST_ACTION_TYPES, actionCreators } from './actions'
import {
  IUserAndExpireTime,
  UserLoggedInDataTransformationInput,
} from './types'
import { IThunkReturnObject } from '../shared/store/store.types'
import { Language } from '../../entities'

export const getAllLanguagesThunk = (): IThunkReturnObject<Language[]> => {
  return {
    requestDataActionType: REQUEST_ACTION_TYPES.ENTERED_SITE_REQUEST,
    apiCall: (): Promise<AxiosResponse<Language[]>> => {
      return axios.get('/api/language')
    },
    dispatchActionOnSuccess: actionCreators.gotAllLanguages,
  }
}

export const checkIfUserLoggedInProcess = (): IThunkReturnObject<
  IUserAndExpireTime
> => {
  return {
    requestDataActionType:
      REQUEST_ACTION_TYPES.CHECKING_IF_USER_LOGGED_IN_REQUEST,
    apiCall: (): Promise<AxiosResponse<IUserAndExpireTime>> => {
      return axios.get('/api/auth')
    },
    dispatchActionOnSuccess: actionCreators.loggedInUserFoundEnteringSite,
  }
}

export const userLoggedInDataRetrivalThunk = (
  userId: string
): IThunkReturnObject<UserLoggedInDataTransformationInput> => {
  return {
    requestDataActionType:
      REQUEST_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/chatgroup/${userId}`),
        axios.get(`/api/userlanguage/${userId}/linkedto`),
        axios.get(`/api/user/${userId}/linkedto`),
        axios.get(`/api/userchatgroup/${userId}/linkedto`),
        axios.get(`/api/chatgroupinvite/${userId}`),
        axios.get(`/api/notification/${userId}`),
        axios.get(`/api/message/user/${userId}`),
      ])
    },
    dispatchActionOnSuccess: actionCreators.userLoggedIn,
  }
}
