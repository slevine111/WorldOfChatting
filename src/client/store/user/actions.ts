import { User } from '../../../entities'
import { SET_USERS, CREATE_NEW_USER } from './types'
import axios, { AxiosResponse } from 'axios'
import { ThunkAction } from 'redux-thunk'

const setUsers = (users: User[]) => ({
  type: SET_USERS,
  users
})
type SetUsersType = ReturnType<typeof setUsers>

export const createNewUser = (newUser: User) => ({
  type: CREATE_NEW_USER,
  newUser
})
type CreateNewUserType = ReturnType<typeof createNewUser>

export type UserActionTypes = SetUsersType | CreateNewUserType

export const setUsersThunk = (
  userIds: string[]
): ThunkAction<Promise<void>, User[], string[], SetUsersType> => {
  return dispatch => {
    return axios
      .get('/api/user/linked/loggedin', { params: { userIds } })
      .then(({ data }: AxiosResponse<User[]>) => {
        dispatch(setUsers(data))
      })
  }
}
