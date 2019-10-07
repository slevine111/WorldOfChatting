import { User } from '../../../entities'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import { SET_USER, ISetLoggedInUserAction } from './types'
import { ThunkAction } from 'redux-thunk'
import axios, { AxiosResponse } from 'axios'

const setLoggedInUser = (user: User): ISetLoggedInUserAction => ({
  type: SET_USER,
  user
})

export const loginUserThunk = (
  userEmailAndPassword: IUserSignInDTO
): ThunkAction<Promise<void>, User, IUserSignInDTO, ISetLoggedInUserAction> => {
  return dispatch => {
    return axios
      .post('/api/auth/login', userEmailAndPassword)
      .then(({ data }: AxiosResponse<User>) => {
        dispatch(setLoggedInUser(data))
      })
  }
}

export const checkIfUserLoggedInThunk = (): ThunkAction<
  Promise<void>,
  User,
  null,
  ISetLoggedInUserAction
> => {
  return dispatch => {
    return axios.get('/api/auth').then(({ data }: AxiosResponse<User>) => {
      dispatch(setLoggedInUser(data))
    })
  }
}

export const logoutUserThunk = (): ThunkAction<
  Promise<void>,
  void,
  null,
  ISetLoggedInUserAction
> => {
  return dispatch => {
    return axios.delete('/api/auth').then((): void => {
      dispatch(setLoggedInUser({} as User))
    })
  }
}
