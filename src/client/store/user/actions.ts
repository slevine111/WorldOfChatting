import { User } from '../../../entities'
import { SET_USERS, CREATE_NEW_USER } from './types'

export const setUsers = (users: User[]) => ({
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
