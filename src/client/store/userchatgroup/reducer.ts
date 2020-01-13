import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  RequestDataConstants,
  OnApiFailureActionTypes
} from '../shared/types'
import { IAxiosErrorData } from '../apiMiddleware'
import { SharedActionsTypes } from '../shared/actions'
import { UserChatGroup } from '../../../entities'
const { REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants
const {
  REQUEST_DATA_USER_LOGGED_IN_FAILED,
  USER_LOGGING_OUT_REQUEST_FAILED
} = OnApiFailureActionTypes

export interface IUserChatGroupReducerState {
  data: UserChatGroup[]
  isLoading: boolean
  error: null | IAxiosErrorData
}

const initialState: IUserChatGroupReducerState = {
  data: [],
  isLoading: false,
  error: null
}

export default (
  state: IUserChatGroupReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserChatGroupReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case USER_LOGGED_IN:
      return {
        data: action.userChatGroups,
        isLoading: action.isLoading,
        error: action.error
      }
    case REQUEST_DATA_USER_LOGGED_IN:
      return { ...initialState, isLoading: action.isLoading }
    case REQUEST_DATA_USER_LOGGED_IN_FAILED:
      return { ...initialState, error: action.error }
    case USER_LOGGING_OUT_REQUEST_FAILED:
    default:
      return state
  }
}
