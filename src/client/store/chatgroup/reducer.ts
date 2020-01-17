import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  RequestDataConstants,
  OnApiFailureActionTypes
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IBaseReducer } from '../reducer.base'
import { IChatGroupReducer } from '../../../shared-types'
const { REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants
const {
  REQUEST_DATA_USER_LOGGED_IN_FAILED,
  USER_LOGGING_OUT_REQUEST_FAILED,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILED
} = OnApiFailureActionTypes

export type IChatGroupReducerState = IBaseReducer<IChatGroupReducer>

const initialState: IChatGroupReducerState = {
  data: {},
  isLoading: false,
  error: null
}

export default (
  state: IChatGroupReducerState = { ...initialState },
  action: SharedActionsTypes
): IChatGroupReducerState => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        data: action.chatGroups,
        isLoading: action.isLoading,
        error: action.error
      }
    case REQUEST_DATA_USER_LOGGED_IN:
      return { ...initialState, isLoading: action.isLoading }
    case REQUEST_DATA_USER_LOGGED_IN_FAILED:
      return { ...initialState, error: action.error }
    case LOGOUT_USER_PROCESS:
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILED:
      return { ...initialState }
    case USER_LOGGING_OUT_REQUEST_FAILED:
    default:
      return state
  }
}
