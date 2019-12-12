import {
  SET_MY_USERS,
  SET_CURRENT_LANGUAGE_USERS,
  SET_MY_AND_CURRENT_LANGUAGE_USERS
} from './types'
import { UserActionTypes } from './actions'
import { IUserFieldsForStore } from '../../../shared-types'

export interface IUserReducerState {
  myUsers: IUserFieldsForStore[]
  currentLanguageUsers: IUserFieldsForStore[]
}

export default (
  state: IUserReducerState = { myUsers: [], currentLanguageUsers: [] },
  action: UserActionTypes
): IUserReducerState => {
  switch (action.type) {
    case SET_MY_AND_CURRENT_LANGUAGE_USERS:
      return {
        myUsers: action.myUsers,
        currentLanguageUsers: action.currentLanguageUsers
      }
    case SET_MY_USERS:
      return { ...state, myUsers: action.users }
    case SET_CURRENT_LANGUAGE_USERS:
      return { ...state, currentLanguageUsers: action.users }
    default:
      return state
  }
}
