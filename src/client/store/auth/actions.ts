import { ADD_POSTPONNED_ACTION, IUserAndExpireTime } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { IThunkReturnObject } from '../APIRequestsHandling/types'

export const addPostponnedAction = (postponnedAction: IThunkReturnObject) => ({
  type: ADD_POSTPONNED_ACTION,
  postponnedAction
})
type AddPostponnedActionReturn = ReturnType<typeof addPostponnedAction>

export const loggedInUserFoundEnteringSite = (data: IUserAndExpireTime) => ({
  type: <const>(
    RequestDataSuccessConstants.CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS
  ),
  user: data.user,
  tokenExpireTime: data.expireTime
})
type LoggedInUserFoundEnteringSiteActionReturn = ReturnType<
  typeof loggedInUserFoundEnteringSite
>

export const userLoginAttemptSucceeded = (data: IUserAndExpireTime) => ({
  type: <const>(
    RequestDataSuccessConstants.AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS
  ),
  user: data.user,
  tokenExpireTime: data.expireTime
})
type UserLoginAttemptSucceededActionReturn = ReturnType<
  typeof userLoginAttemptSucceeded
>

export const accessTokenRefreshed = (accessTokenExpireTime: number) => ({
  type: <const>(
    RequestDataSuccessConstants.REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS
  ),
  accessTokenExpireTime
})
type AccessTokenRefreshedActionReturn = ReturnType<typeof accessTokenRefreshed>

export type AuthActionTypes =
  | LoggedInUserFoundEnteringSiteActionReturn
  | AddPostponnedActionReturn
  | UserLoginAttemptSucceededActionReturn
  | AccessTokenRefreshedActionReturn
