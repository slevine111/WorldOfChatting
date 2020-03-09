import { ADD_POSTPONNED_ACTION, IUserAndExpireTime } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { IThunkReturnObject } from '../APIRequestsHandling/types'

export const addPostponnedAction = (postponnedAction: IThunkReturnObject) => ({
  type: ADD_POSTPONNED_ACTION,
  postponnedAction
})

export const loggedInUserFoundEnteringSite = (data: IUserAndExpireTime) => ({
  type: <const>(
    RequestDataSuccessConstants.CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS
  ),
  user: data.user,
  tokenExpireTime: data.expireTime
})

export const userLoginAttemptSucceeded = (data: IUserAndExpireTime) => ({
  type: <const>(
    RequestDataSuccessConstants.AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS
  ),
  user: data.user,
  tokenExpireTime: data.expireTime
})

export const accessTokenRefreshed = (accessTokenExpireTime: number) => ({
  type: <const>(
    RequestDataSuccessConstants.REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS
  ),
  accessTokenExpireTime
})

export type AuthActionReturns =
  | ReturnType<typeof addPostponnedAction>
  | ReturnType<typeof loggedInUserFoundEnteringSite>
  | ReturnType<typeof userLoginAttemptSucceeded>
  | ReturnType<typeof accessTokenRefreshed>
