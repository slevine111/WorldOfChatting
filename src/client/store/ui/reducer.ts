import { ReducerErrorProperty } from '../reducer.base'
import {
  UIAPICallingActionReturns,
  RequestDataConstants,
  RequestDataSuccessConstants,
  TRIGGER_DATA_REQUEST,
  DATA_REQUEST_FAILURE
} from '../APIRequestsHandling/types'
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants

export interface UIReducerState {
  apiCalling: {
    dataLoading: boolean
    error: ReducerErrorProperty
    event: RequestDataConstants | ''
    accessTokenBeingRefreshed: boolean
  }
}

const initialState: UIReducerState = {
  apiCalling: {
    dataLoading: false,
    error: null,
    event: '',
    accessTokenBeingRefreshed: false
  }
}

export default (
  state: UIReducerState = { ...initialState },
  action: UIAPICallingActionReturns
): UIReducerState => {
  if (
    RequestDataSuccessConstants[
      action.type as keyof typeof RequestDataSuccessConstants
    ] !== undefined
  ) {
    return {
      ...state,
      apiCalling: initialState.apiCalling
    }
  }

  switch (action.type) {
    case TRIGGER_DATA_REQUEST:
      return {
        ...state,
        apiCalling: {
          dataLoading: true,
          error: null,
          event: action.eventTriggeringDataRequest,
          accessTokenBeingRefreshed: false
        }
      }
    case REFRESHING_ACCESS_TOKEN_REQUEST:
      return {
        ...state,
        apiCalling: { ...state.apiCalling, accessTokenBeingRefreshed: true }
      }
    case DATA_REQUEST_FAILURE:
      return {
        ...state,
        apiCalling: {
          dataLoading: false,
          error: action.error,
          event: action.event,
          accessTokenBeingRefreshed: false
        }
      }
    default:
      return state
  }
}
