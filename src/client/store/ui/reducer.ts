import { ReducerErrorProperty } from '../reducer.base'
import {
  UIAPICallingActionReturns,
  RequestDataConstants,
  RequestDataSuccessConstants,
  TRIGGER_DATA_REQUEST,
  DATA_REQUEST_FAILURE
} from '../APIRequestsHandling/types'

export interface UIReducerState {
  apiCalling: {
    dataLoading: boolean
    error: ReducerErrorProperty
    event: RequestDataConstants | ''
  }
}

const initialState: UIReducerState = {
  apiCalling: { dataLoading: false, error: null, event: '' }
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
      apiCalling: { dataLoading: false, error: null, event: '' }
    }
  }

  switch (action.type) {
    case TRIGGER_DATA_REQUEST:
      return {
        ...state,
        apiCalling: {
          dataLoading: true,
          error: null,
          event: action.eventTriggeringDataRequest
        }
      }
    case DATA_REQUEST_FAILURE:
      return {
        ...state,
        apiCalling: {
          dataLoading: false,
          error: action.error,
          event: state.apiCalling.event
        }
      }
    default:
      return state
  }
}
