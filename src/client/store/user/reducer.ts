import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  RequestDataConstants
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IReduxStoreUserFields } from '../../../shared-types'
const { REQUEST_DATA_API, REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants

interface IUserReducerDataSlice {
  data: IReduxStoreUserFields[]
  isLoading: boolean
}

export interface IUserReducerState {
  myUsers: IUserReducerDataSlice
  currentLanguageUsers: IUserReducerDataSlice
}

const initialState: IUserReducerState = {
  myUsers: { data: [], isLoading: false },
  currentLanguageUsers: { data: [], isLoading: false }
}

export default (
  state: IUserReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...state }
    case REQUEST_DATA_USER_LOGGED_IN:
      return {
        myUsers: { data: [], isLoading: true },
        currentLanguageUsers: { data: [], isLoading: false }
      }
    case USER_LOGGED_IN:
      const { currentLanguageUsers } = state
      return {
        myUsers: { data: action.users, isLoading: action.isLoading },
        currentLanguageUsers
      }
    case REQUEST_DATA_API:
      const {
        myUsers: { data }
      } = state
      return {
        myUsers: { data, isLoading: false },
        currentLanguageUsers: { data: [], isLoading: true }
      }
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      const { myUsers } = state
      return {
        myUsers,
        currentLanguageUsers: {
          data: action.users,
          isLoading: action.isLoading
        }
      }
    default:
      return state
  }
}
