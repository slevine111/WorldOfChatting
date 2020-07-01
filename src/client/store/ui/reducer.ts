import { WENT_TO_CHAT_PAGE } from './types'
import { UIActionReturns } from './actions'
import { ReducerErrorProperty } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import {
  UIAPICallingActionReturns,
  RequestDataConstants,
  RequestDataSuccessConstants,
  TRIGGER_DATA_REQUEST,
  DATA_REQUEST_FAILURE,
} from '../APIRequestsHandling/types'
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants
const { CLICKED_ON_CHAT_GROUP_SUCCESS } = RequestDataSuccessConstants

export interface UIReducerState {
  apiCalling: {
    dataLoading: boolean
    error: ReducerErrorProperty
    event: RequestDataConstants | ''
    accessTokenBeingRefreshed: boolean
  }
  currentChatId: string
}

export const uiInitialState: UIReducerState = {
  apiCalling: {
    dataLoading: false,
    error: null,
    event: '',
    accessTokenBeingRefreshed: false,
  },
  currentChatId: '',
}

export default (
  state: UIReducerState = { ...uiInitialState },
  action: UIAPICallingActionReturns | SharedActionsTypes | UIActionReturns
): UIReducerState => {
  if (
    RequestDataSuccessConstants[
      action.type as keyof typeof RequestDataSuccessConstants
    ] !== undefined
  ) {
    return {
      ...state,
      apiCalling: uiInitialState.apiCalling,
      currentChatId:
        action.type === CLICKED_ON_CHAT_GROUP_SUCCESS
          ? action.updatedChatGroup.id
          : state.currentChatId,
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
          accessTokenBeingRefreshed: false,
        },
      }
    case REFRESHING_ACCESS_TOKEN_REQUEST:
      return {
        ...state,
        apiCalling: { ...state.apiCalling, accessTokenBeingRefreshed: true },
      }
    case DATA_REQUEST_FAILURE:
      return {
        ...state,
        apiCalling: {
          dataLoading: false,
          error: action.error,
          event: action.event,
          accessTokenBeingRefreshed: false,
        },
      }
    case WENT_TO_CHAT_PAGE:
      return { ...state, currentChatId: action.chatGroupId }
    default:
      return state
  }
}
