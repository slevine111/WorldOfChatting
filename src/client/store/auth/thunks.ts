import {
  setAccessTokenStatus,
  setAccessTokenFields,
  setUserAndAccessTokenFields
} from './actions'
import { IUserAndExpireTime, PossibleStatuses } from './types'
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
    dispatch(setAccessTokenStatus(PossibleStatuses.FETCHING))
    return axios
      .get('/api/auth/refreshToken')
      .then(({ data }: AxiosResponse<number>) => {
        dispatch(setAccessTokenFields(PossibleStatuses.RECEIVED, data))
      })
  }
}

export const loginUserProcess = (userEmailAndPassword: IUserSignInDTO) => {
  return (dispatch: any) => {
    return axios
      .post('/api/auth/login', userEmailAndPassword)
      .then(({ data }: AxiosResponse<IUserAndExpireTime>) => {
        let { user, expireTime } = data
        dispatch(
          setUserAndAccessTokenFields(
            { ...user, languages: [] },
            PossibleStatuses.RECEIVED,
            expireTime
          )
        )
      })
  }
}

export const checkIfUserLoggedInProcess = () => {
  return (dispatch: any) => {
    return axios
      .get('/api/auth')
      .then(({ data }: AxiosResponse<IUserAndExpireTime>) => {
        let { user, expireTime } = data
        dispatch(
          setUserAndAccessTokenFields(
            { ...user, languages: [] },
            PossibleStatuses.RECEIVED,
            expireTime
          )
        )
      })
  }
}
