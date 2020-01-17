import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { IBaseReducer } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserChatGroup } from '../../../entities'
const { HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST } = RequestDataConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE
} = RequestDataFailureConstants

export type IUserChatGroupReducerState = IBaseReducer<UserChatGroup[]>

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
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return {
        data: action.userChatGroups,
        isLoading: action.isLoading,
        error: action.error
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST:
      return { ...initialState, isLoading: action.isLoading }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE:
      return { ...initialState, error: action.error }
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}
