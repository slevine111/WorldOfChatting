import { User } from '../../../entities'
import { SET_USERS } from './types'

export const setUsers = (users: User[]) => ({
  type: SET_USERS,
  users
})
type SetUsersType = ReturnType<typeof setUsers>

export type UserActionTypes = SetUsersType
