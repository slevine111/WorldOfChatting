import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { IBaseReducer, INormalizedReducerShape } from '../reducer.base'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { normalizeData } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const { HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST } = RequestDataConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE
} = RequestDataFailureConstants

export type INotificationsNormalizedShape = INormalizedReducerShape<
  INotificationReducerFields
>

export type INotificationReducerState = IBaseReducer<
  INotificationsNormalizedShape
>

const initialState: INotificationReducerState = {
  data: { byId: {}, allIds: [], subGroupings: {} },
  isLoading: false,
  error: null
}

export default (
  state: INotificationReducerState = { ...initialState },
  action: SharedActionsTypes
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return {
        data: normalizeData(action.notifications),
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
