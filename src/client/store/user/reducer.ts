import { SET_USERS } from './types'
import { UserActionTypes } from './actions'
import { User } from '../../../entities'

export default (state: User[] = [], action: UserActionTypes): User[] => {
  switch (action.type) {
    case SET_USERS:
      return action.users
    default:
      return state
  }
}
