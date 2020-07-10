import axios from 'axios'
import {
  userLoginSucceeded,
  AUTHENTICATING_USER_LOGIN_REQUEST,
} from './actions'
import {
  IThunkReturnObject,
  IUserAndExpireTime,
} from '../../shared/store/store.types'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'

export const loginUserProcess = (
  userEmailAndPassword: IUserSignInDTO
): IThunkReturnObject<IUserAndExpireTime> => {
  return {
    requestDataActionType: AUTHENTICATING_USER_LOGIN_REQUEST,
    apiCall: () => {
      return axios.post('/api/auth/login', userEmailAndPassword)
    },
    dispatchActionOnSuccess: userLoginSucceeded,
  }
}
