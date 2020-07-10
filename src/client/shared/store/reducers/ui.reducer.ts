import {
  ACTION_TYPES,
  APIMiddlewareActionReturns,
} from '../middleware/api/actions'
import { IAxiosErrorData } from '../store.types'

export interface UIReducerState {
  apiCalling: {
    dataLoading: boolean
    error: null | IAxiosErrorData
    event: string
    accessTokenBeingRefreshed: boolean
  }
}

export const uiInitialState: UIReducerState = {
  apiCalling: {
    dataLoading: false,
    error: null,
    event: '',
    accessTokenBeingRefreshed: false,
  },
}

export const uiReducer = (
  state: UIReducerState = uiInitialState,
  action: APIMiddlewareActionReturns
): UIReducerState => {
  switch (action.type) {
    case ACTION_TYPES.TRIGGER_DATA_REQUEST:
      return {
        ...state,
        apiCalling: {
          dataLoading: true,
          error: null,
          event: action.eventTriggeringDataRequest,
          accessTokenBeingRefreshed: false,
        },
      }
    case ACTION_TYPES.REFRESHING_ACCESS_TOKEN_REQUEST:
      return {
        ...state,
        apiCalling: { ...state.apiCalling, accessTokenBeingRefreshed: true },
      }
    case ACTION_TYPES.DATA_REQUEST_FAILURE:
      return {
        ...state,
        apiCalling: {
          dataLoading: false,
          error: action.error,
          event: action.event,
          accessTokenBeingRefreshed: false,
        },
      }
    case ACTION_TYPES.DATA_REQUEST_SUCCESS:
      return {
        ...state,
        apiCalling: uiInitialState.apiCalling,
      }
    default:
      return state
  }
}
