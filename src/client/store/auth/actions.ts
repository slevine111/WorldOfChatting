import { ADD_POSTPONNED_ACTION, IUserAndExpireTime } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { IThunkReturnObject } from '../APIRequestsHandling/types'

export const addPostponnedAction = (postponnedAction: IThunkReturnObject) => ({
  type: ADD_POSTPONNED_ACTION,
  postponnedAction
})
type AddPostponnedActionReturn = ReturnType<typeof addPostponnedAction>

export const loggedInUserFoundEnteringSite = (
  data: IUserAndExpireTime,
  isLoading: boolean,
  error: null
) => ({
  type: <const>(
    RequestDataSuccessConstants.CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS
  ),
  user: data.user,
  tokenExpireTime: data.expireTime,
  isLoading,
  error
})
type LoggedInUserFoundEnteringSiteActionReturn = ReturnType<
  typeof loggedInUserFoundEnteringSite
>

export const userLoginAttemptSucceeded = (
  data: IUserAndExpireTime,
  isLoading: boolean,
  error: null
) => ({
  type: <const>(
    RequestDataSuccessConstants.AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS
  ),
  user: data.user,
  tokenExpireTime: data.expireTime,
  isLoading,
  error
})
type UserLoginAttemptSucceededActionReturn = ReturnType<
  typeof userLoginAttemptSucceeded
>

export const accessTokenRefreshed = (
  accessTokenExpireTime: number,
  isLoading: boolean,
  error: null
) => ({
  type: <const>(
    RequestDataSuccessConstants.REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS
  ),
  accessTokenExpireTime,
  isLoading,
  error
})
type AccessTokenRefreshedActionReturn = ReturnType<typeof accessTokenRefreshed>

export type AuthActionTypes =
  | LoggedInUserFoundEnteringSiteActionReturn
  | AddPostponnedActionReturn
  | UserLoginAttemptSucceededActionReturn
  | AccessTokenRefreshedActionReturn
