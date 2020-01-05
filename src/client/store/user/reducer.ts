import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IReduxStoreUserFields } from '../../../shared-types'

export interface IUserReducerState {
  myUsers: IReduxStoreUserFields[]
  currentLanguageUsers: IReduxStoreUserFields[]
}

export default (
  state: IUserReducerState = { myUsers: [], currentLanguageUsers: [] },
  action: SharedActionsTypes
): IUserReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { myUsers: [], currentLanguageUsers: [] }
    case USER_LOGGED_IN:
      return { ...state, myUsers: action.users }
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      return { ...state, currentLanguageUsers: action.users }
    default:
      return state
  }
}
