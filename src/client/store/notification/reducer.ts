import {
  RequestDataConstants,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { INormalizedReducerShape } from '../reducer.base'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { normalizeData } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants

export type INotificationReducerState = INormalizedReducerShape<
  INotificationReducerFields
>

const initialState: INotificationReducerState = {
  byId: {},
  allIds: [],
  subGroupings: {}
}

export default (
  state: INotificationReducerState = { ...initialState },
  action: SharedActionsTypes
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.notifications)
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
    case REFRESHING_ACCESS_TOKEN_REQUEST:
      return { ...initialState }
    default:
      return state
  }
}
