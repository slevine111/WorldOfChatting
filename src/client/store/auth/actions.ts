import {
  ADD_POSTPONNED_ACTION,
  IUserAndExpireTime,
  USER_LOGGING_IN_FOUND,
  ACCESS_TOKEN_REFRESHED
} from './types'
import { IThunkReturnObject } from '../APIRequestsHandling/types'

export const addPostponnedAction = (postponnedAction: IThunkReturnObject) => ({
  type: ADD_POSTPONNED_ACTION,
  postponnedAction
})
type AddPostponnedActionType = ReturnType<typeof addPostponnedAction>

export const userLoggingInFound = (
  data: IUserAndExpireTime,
  isLoading: boolean,
  error: null
) => ({
  type: USER_LOGGING_IN_FOUND,
  user: data.user,
  tokenExpireTime: data.expireTime,
  isLoading,
  error
})
type UserLoggingInFoundActionReturn = ReturnType<typeof userLoggingInFound>

export const accessTokenRefreshed = (
  accessTokenExpireTime: number,
  isLoading: boolean,
  error: null
) => ({
  type: ACCESS_TOKEN_REFRESHED,
  accessTokenExpireTime,
  isLoading,
  error
})
type AccessTokenRefreshedActionReturned = ReturnType<
  typeof accessTokenRefreshed
>

export type AuthActionTypes =
  | AddPostponnedActionType
  | UserLoggingInFoundActionReturn
  | AccessTokenRefreshedActionReturned
