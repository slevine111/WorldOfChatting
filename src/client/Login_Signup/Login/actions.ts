import { IUserAndExpireTime } from '../../shared/store/store.types'

export const AUTHENTICATING_USER_LOGIN_REQUEST = <const>(
  'AUTHENTICATING_USER_LOGIN_REQUEST'
)
export const AUTHENTICATING_USER_LOGIN_REQUEST_SUCCESS = <const>(
  'AUTHENTICATING_USER_LOGIN_REQUEST_SUCCESS'
)
export const userLoginSucceeded = (data: IUserAndExpireTime) => ({
  type: AUTHENTICATING_USER_LOGIN_REQUEST_SUCCESS,
  user: data.user,
  tokenExpireTime: data.expireTime,
})
export type UserLoginSucceededAR = ReturnType<typeof userLoginSucceeded>
