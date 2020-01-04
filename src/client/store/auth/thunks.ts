import { setAccessTokenStatus, setAccessTokenFields } from './actions'
import { IUserAndExpireTime } from './types'
import { getAndSetSingleUserRelatedData } from '../common/shared-actions'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import axios, { AxiosResponse } from 'axios'
import { ThunkAction } from 'redux-thunk'
import { AnyAction } from 'redux'

export const refreshToken = (): ThunkAction<
  Promise<void>,
  number,
  null,
  AnyAction
> => {
  return dispatch => {
    dispatch(setAccessTokenStatus('FETCHING'))
    return axios
      .get('/api/auth/refreshToken')
      .then(({ data }: AxiosResponse<number>) => {
        dispatch(setAccessTokenFields('RECEIVED', data))
      })
  }
}

export const loginUserProcess = (userEmailAndPassword: IUserSignInDTO) => {
  return (dispatch: any) => {
    return axios
      .post('/api/auth/login', userEmailAndPassword)
      .then(({ data }: AxiosResponse<IUserAndExpireTime>) => {
        getAndSetSingleUserRelatedData(data, dispatch)
      })
  }
}

export const checkIfUserLoggedInProcess = () => {
  return (dispatch: any) => {
    return axios
      .get('/api/auth')
      .then(({ data }: AxiosResponse<IUserAndExpireTime>) => {
        getAndSetSingleUserRelatedData(data, dispatch)
      })
  }
}
