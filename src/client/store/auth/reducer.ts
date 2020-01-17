import { ADD_POSTPONNED_ACTION } from './types'
import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { User } from '../../../entities'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { AuthActionTypes } from './actions'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import { ReducerErrorProperty } from '../reducer.base'
const {
  CHECKING_IF_USER_LOGGED_IN_REQUEST,
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST,
  REFRESHING_ACCESS_TOKEN_REQUEST,
  USER_LOGGING_OUT_REQUEST
} = RequestDataConstants
const {
  CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS,
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS,
  REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const {
  CHECKING_IF_USER_LOGGED_IN_REQUEST_FAILURE,
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE,
  USER_LOGGING_OUT_REQUEST_FAILURE
} = RequestDataFailureConstants

export interface IAuthReducerState {
  user: { data: User; isLoading: boolean }
  accessToken: { tokenExpireTime: number; isLoading: boolean }
  error:
    | null
    | (ReducerErrorProperty & { actionType: RequestDataFailureConstants })
  postponnedActions: IThunkReturnObject[]
}

const initialState: IAuthReducerState = {
  user: { data: {} as User, isLoading: false },
  accessToken: { tokenExpireTime: Number.POSITIVE_INFINITY, isLoading: false },
  error: null,
  postponnedActions: []
}

export default (
  state: IAuthReducerState = initialState,
  action: AuthActionTypes | SharedActionsTypes
): IAuthReducerState => {
  switch (action.type) {
    //authenticating user
    case CHECKING_IF_USER_LOGGED_IN_REQUEST:
    case AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST:
      return {
        ...initialState,
        user: { data: initialState.user.data, isLoading: action.isLoading }
      }
    case CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS:
    case AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS:
      return {
        user: { data: action.user, isLoading: action.isLoading },
        accessToken: {
          tokenExpireTime: action.tokenExpireTime,
          isLoading: initialState.accessToken.isLoading
        },
        error: action.error,
        postponnedActions: initialState.postponnedActions
      }
    //refreshing token
    case REFRESHING_ACCESS_TOKEN_REQUEST:
      return {
        ...state,
        accessToken: {
          tokenExpireTime: initialState.accessToken.tokenExpireTime,
          isLoading: action.isLoading
        }
      }
    case REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS:
      return {
        ...state,
        accessToken: {
          tokenExpireTime: action.accessTokenExpireTime,
          isLoading: action.isLoading
        },
        error: action.error
      }
    //no user found when authenticating or refreshing token failed
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
    case CHECKING_IF_USER_LOGGED_IN_REQUEST_FAILURE:
    case AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE:
      return {
        ...initialState,
        error: { ...action.error, actionType: action.type }
      }
    //logging user out
    case USER_LOGGING_OUT_REQUEST:
      return {
        ...state,
        user: { data: state.user.data, isLoading: action.isLoading }
      }
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...initialState }
    case USER_LOGGING_OUT_REQUEST_FAILURE:
      return {
        ...state,
        user: { data: state.user.data, isLoading: action.isLoading },
        error: { ...action.error, actionType: action.type }
      }
    //adding postponned action (when api call is made and token being refreshed)
    case ADD_POSTPONNED_ACTION:
      return {
        ...state,
        postponnedActions: [...state.postponnedActions, action.postponnedAction]
      }
    default:
      return state
  }
}
