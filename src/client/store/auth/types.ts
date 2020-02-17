import { User } from '../../../entities'

export const ADD_POSTPONNED_ACTION = <const>'ADD_POSTPONNED_ACTION'

export interface IUserAndExpireTime {
  user: User
  expireTime: number
}
