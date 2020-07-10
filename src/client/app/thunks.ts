import axios, { AxiosResponse } from 'axios'
import { REQUEST_ACTION_TYPES, actionCreators } from './actions'
import {
  IUserAndExpireTime,
  UserLoggedInDataTransformationInput,
} from './types'
import { IThunkReturnObject } from '../shared/store/store.types'
import { Language, User } from '../../entities'

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
  user: User
): IThunkReturnObject<UserLoggedInDataTransformationInput> => {
  return {
    requestDataActionType:
      REQUEST_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/chatgroup/${user.id}`),
        axios.get(`/api/userlanguage/${user.id}/linkedto`),
        axios.get(`/api/user/${user.id}/linkedto`),
        axios.get(`/api/userchatgroup/${user.id}/linkedto`),
        axios.get(`/api/chatgroupinvite/${user.id}`),
        axios.get(`/api/notification/${user.id}`),
        axios.get(`/api/message/user/${user.id}`),
      ])
    },
    dispatchActionOnSuccess: actionCreators.userLoggedIn,
  }
}
