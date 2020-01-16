import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  RequestDataConstants,
  OnApiFailureActionTypes
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IReduxStoreUserFields } from '../../../shared-types'
import { IAxiosErrorData } from '../apiMiddleware'
const { REQUEST_DATA_API, REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants
const {
  REQUEST_DATA_USER_LOGGED_IN_FAILED,
  REQUEST_DATA_API_FAILED,
  USER_LOGGING_OUT_REQUEST_FAILED,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILED
} = OnApiFailureActionTypes

export interface IUserReducerDataSlice {
  data: IReduxStoreUserFields[]
  isLoading: boolean
  error: null | IAxiosErrorData
}

export interface IUserReducerState {
  myUsers: IUserReducerDataSlice
  currentLanguageUsers: IUserReducerDataSlice
}

const initialStateDataSlice: IUserReducerDataSlice = {
  data: [],
  isLoading: false,
  error: null
}

const initialState: IUserReducerState = {
  myUsers: initialStateDataSlice,
  currentLanguageUsers: initialStateDataSlice
}

export default (
  state: IUserReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserReducerState => {
  switch (action.type) {
    case REQUEST_DATA_USER_LOGGED_IN:
      return {
        myUsers: { ...initialState.myUsers, isLoading: action.isLoading },
        currentLanguageUsers: { ...initialState.currentLanguageUsers }
      }
    case USER_LOGGED_IN:
      return {
        myUsers: {
          data: action.users,
          isLoading: action.isLoading,
          error: action.error
        },
        currentLanguageUsers: { ...initialState.currentLanguageUsers }
      }
    case REQUEST_DATA_USER_LOGGED_IN_FAILED:
      return {
        myUsers: { ...initialState.myUsers, error: action.error },
        currentLanguageUsers: { ...initialState.currentLanguageUsers }
      }
    case REQUEST_DATA_API:
      return {
        myUsers: { ...state.myUsers },
        currentLanguageUsers: {
          ...initialState.currentLanguageUsers,
          isLoading: action.isLoading
        }
      }
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      const { myUsers } = state
      return {
        myUsers,
        currentLanguageUsers: {
          data: action.users,
          isLoading: action.isLoading,
          error: action.error
        }
      }
    case REQUEST_DATA_API_FAILED:
      return {
        myUsers: { ...state.myUsers },
        currentLanguageUsers: {
          ...initialState.currentLanguageUsers,
          error: action.error
        }
      }
    case LOGOUT_USER_PROCESS:
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILED:
      return { ...initialState }
    case USER_LOGGING_OUT_REQUEST_FAILED:
    default:
      return state
  }
}
