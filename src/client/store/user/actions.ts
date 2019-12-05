import { User } from '../../../entities'
import {
  SET_MY_USERS,
  SET_CURRENT_LANGUAGE_USERS,
  SET_MY_AND_CURRENT_LANGUAGE_USERS
} from './types'

export const setMyUsers = (users: User[]) => ({
  type: SET_MY_USERS,
  users
})
type SetMyUsersType = ReturnType<typeof setMyUsers>

export const setCurrentLanguageUsers = (users: User[]) => ({
  type: SET_CURRENT_LANGUAGE_USERS,
  users
})
type SetCurrentLanguageUsersType = ReturnType<typeof setCurrentLanguageUsers>

export const setMyAndCurrentLanguageUsers = (
  myUsers: User[],
  currentLanguageUsers: User[]
) => ({
  type: SET_MY_AND_CURRENT_LANGUAGE_USERS,
  myUsers,
  currentLanguageUsers
})
type SetMyAndCurrentLanguageUsersType = ReturnType<
  typeof setMyAndCurrentLanguageUsers
>

export type UserActionTypes =
  | SetMyUsersType
  | SetCurrentLanguageUsersType
  | SetMyAndCurrentLanguageUsersType
