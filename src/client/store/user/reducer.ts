import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  REQUEST_DATA_API
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IReduxStoreUserFields } from '../../../shared-types'

export interface IUserReducerState {
  data: {
    myUsers: IReduxStoreUserFields[]
    currentLanguageUsers: IReduxStoreUserFields[]
  }

  isLoading: boolean
}

const initialState: IUserReducerState = {
  data: { myUsers: [], currentLanguageUsers: [] },
  isLoading: false
}

export default (
  state: IUserReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserReducerState => {
  const { data } = state
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...state }
    case USER_LOGGED_IN:
      return { ...state, data: { ...data, myUsers: action.users } }
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      return {
        isLoading: action.isLoading,
        data: { ...data, currentLanguageUsers: action.users }
      }
    case REQUEST_DATA_API:
      return { ...state, isLoading: true }
    default:
      return state
  }
}
