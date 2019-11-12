import { SET_USERS, CREATE_NEW_USER } from './types'
import { UserActionTypes } from './actions'
import { User } from '../../../entities'

export default (state: User[] = [], action: UserActionTypes): User[] => {
  switch (action.type) {
    case SET_USERS:
      return action.users
    case CREATE_NEW_USER:
      return [...state, action.newUser]
    default:
      return state
  }
}
