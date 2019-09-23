import { User } from '../../../entities'
import { SET_USER, LoggedInUserActionTypes } from './types'

export default (
  state: User = {} as User,
  action: LoggedInUserActionTypes
): User => {
  switch (action.type) {
    case SET_USER:
      return action.user
    default:
      return state
  }
}
