import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  RequestDataConstants
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IChatGroupReducer } from '../../../shared-types'
const { REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants

export interface IChatGroupReducerState {
  data: IChatGroupReducer
  isLoading: boolean
}

const initialState: IChatGroupReducerState = {
  data: {},
  isLoading: false
}

export default (
  state: IChatGroupReducerState = { ...initialState },
  action: SharedActionsTypes
): IChatGroupReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...state }
    case USER_LOGGED_IN:
      return { data: action.chatGroups, isLoading: action.isLoading }
    case REQUEST_DATA_USER_LOGGED_IN:
      return { data: {}, isLoading: true }
    default:
      return state
  }
}
