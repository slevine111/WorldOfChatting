import { User } from '../../../entities'

export const ADD_POSTPONNED_ACTION = <const>'ADD_POSTPONNED_ACTION'
export const USER_LOGGING_IN_FOUND = <const>'USER_LOGGING_IN_FOUND'
export const ACCESS_TOKEN_REFRESHED = <const>'ACCESS_TOKEN_REFRESHED'

export interface IUserAndExpireTime {
  user: User
  expireTime: number
}
