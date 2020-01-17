import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { IBaseReducer } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
const {
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST,
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST
} = RequestDataConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE
} = RequestDataFailureConstants

export type IUserReducerDataSlice = IBaseReducer<IReduxStoreUserFields[]>

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
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST:
      return {
        myUsers: { ...initialState.myUsers, isLoading: action.isLoading },
        currentLanguageUsers: { ...initialState.currentLanguageUsers }
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return {
        myUsers: {
          data: action.users,
          isLoading: action.isLoading,
          error: action.error
        },
        currentLanguageUsers: { ...initialState.currentLanguageUsers }
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE:
      return {
        myUsers: { ...initialState.myUsers, error: action.error },
        currentLanguageUsers: { ...initialState.currentLanguageUsers }
      }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST:
      return {
        myUsers: { ...state.myUsers },
        currentLanguageUsers: {
          ...initialState.currentLanguageUsers,
          isLoading: action.isLoading
        }
      }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { myUsers } = state
      return {
        myUsers,
        currentLanguageUsers: {
          data: action.users,
          isLoading: action.isLoading,
          error: action.error
        }
      }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE:
      return {
        myUsers: { ...state.myUsers },
        currentLanguageUsers: {
          ...initialState.currentLanguageUsers,
          error: action.error
        }
      }
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
      return { ...initialState }
    default:
      return state
  }
}
