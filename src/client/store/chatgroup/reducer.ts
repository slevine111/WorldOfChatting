import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { IBaseReducerTwo, INormalizedReducerShape } from '../reducer.base'
import { IChatGroupAPIReturn } from '../../../types-for-both-server-and-client'
import { normalizeInitialChatGroupData } from './helperfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const { HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST } = RequestDataConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE
} = RequestDataFailureConstants

export type IChatGroupNormalizedShape = INormalizedReducerShape<
  IChatGroupAPIReturn
> & { subGroupings: { favorites: string[] } }

export type IChatGroupReducerState = IBaseReducerTwo<IChatGroupNormalizedShape>

const initialState: IChatGroupReducerState = {
  data: { byId: {}, allIds: [], subGroupings: { favorites: [] } },
  isLoading: false,
  error: null
}

export default (
  state: IChatGroupReducerState = { ...initialState },
  action: SharedActionsTypes
): IChatGroupReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return {
        data: normalizeInitialChatGroupData(action.chatGroups),
        isLoading: action.isLoading,
        error: action.error
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST:
      return { ...initialState, isLoading: action.isLoading }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE:
      return { ...initialState, error: action.error }
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
      return { ...initialState }
    default:
      return state
  }
}
