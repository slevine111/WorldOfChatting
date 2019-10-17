import {
  setAccessTokenStatus,
  setToInitialState,
  setAccessTokenFields,
  setUserAndAccessTokenFields,
  SetUserAndAccessTokenFieldsActionType
} from './actions'
import { IUserAndExpireTime } from './types'
import axios, { AxiosResponse } from 'axios'
import { ThunkAction } from 'redux-thunk'
import { AnyAction } from 'redux'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'

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

export const loginUserProcess = (
  userEmailAndPassword: IUserSignInDTO
): ThunkAction<
  Promise<void>,
  IUserAndExpireTime,
  IUserSignInDTO,
  SetUserAndAccessTokenFieldsActionType
> => {
  return dispatch => {
    return axios
      .post('/api/auth/login', userEmailAndPassword)
      .then(({ data }: AxiosResponse<IUserAndExpireTime>) => {
        const { expireTime, user } = data
        dispatch(setUserAndAccessTokenFields(user, 'RECEIVED', expireTime))
      })
  }
}

export const checkIfUserLoggedInProcess = (): ThunkAction<
  Promise<void>,
  IUserAndExpireTime,
  null,
  SetUserAndAccessTokenFieldsActionType
> => {
  return dispatch => {
    return axios
      .get('/api/auth')
      .then(({ data }: AxiosResponse<IUserAndExpireTime>) => {
        const { expireTime, user } = data
        dispatch(setUserAndAccessTokenFields(user, 'RECEIVED', expireTime))
      })
  }
}

export const logoutUserThunk = () => {
  const innerFunction = (dispatch: any) => {
    return axios.delete('/api/auth').then((): void => {
      dispatch(setToInitialState())
    })
  }
  innerFunction.bypassRefreshTokenMiddleware = true

  return innerFunction
}