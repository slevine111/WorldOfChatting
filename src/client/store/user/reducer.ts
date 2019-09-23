import { CREATE_NEW_USER, UserActionTypes } from './types'
import { User } from '../../../entities'

export default (state: User[] = [], action: UserActionTypes): User[] => {
  switch (action.type) {
    case CREATE_NEW_USER:
      return [...state, action.newUser]
    default:
      return state
  }
}
