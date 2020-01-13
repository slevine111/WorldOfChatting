import {
  USER_LOGGING_IN_FOUND,
  ACCESS_TOKEN_REFRESHED,
  ADD_POSTPONNED_ACTION
} from './types'
import {
  LOGOUT_USER_PROCESS,
  RequestDataConstants,
  OnApiFailureActionTypes
} from '../shared/types'
import { User } from '../../../entities'
import { SharedActionsTypes } from '../shared/actions'
import { AuthActionTypes } from './actions'
import { IThunkReturnObject, IAxiosErrorData } from '../apiMiddleware'
const {
  AUTHENTICATING_USER_REQUEST,
  REFRESHING_ACCESS_TOKEN_REQUEST,
  USER_LOGGING_OUT_REQUEST
} = RequestDataConstants
const {
  NO_USER_FOUND,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILED,
  USER_LOGGING_OUT_REQUEST_FAILED
} = OnApiFailureActionTypes

export interface IAuthReducerState {
  user: { data: User; isLoading: boolean }
  accessToken: { tokenExpireTime: number; isLoading: boolean }
  error: null | IAxiosErrorData
  postponnedActions: IThunkReturnObject[]
  isLoggingOut: boolean
}

const initialState: IAuthReducerState = {
  user: { data: {} as User, isLoading: false },
  accessToken: { tokenExpireTime: Number.POSITIVE_INFINITY, isLoading: false },
  error: null,
  postponnedActions: [],
  isLoggingOut: false
}

export default (
  state: IAuthReducerState = initialState,
  action: AuthActionTypes | SharedActionsTypes
): IAuthReducerState => {
  switch (action.type) {
    //authenticating user
    case AUTHENTICATING_USER_REQUEST:
      return {
        ...initialState,
        user: { data: initialState.user.data, isLoading: action.isLoading }
      }
    case USER_LOGGING_IN_FOUND:
      return {
        user: { data: action.data.user, isLoading: action.isLoading },
        accessToken: {
          tokenExpireTime: action.data.expireTime,
          isLoading: initialState.accessToken.isLoading
        },
        error: action.error,
        postponnedActions: initialState.postponnedActions,
        isLoggingOut: initialState.isLoggingOut
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
    case ACCESS_TOKEN_REFRESHED:
      return {
        ...state,
        accessToken: {
          tokenExpireTime: action.accessTokenExpireTime,
          isLoading: action.isLoading
        },
        error: action.error
      }
    //no user found when authenticating or refreshing token failed
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILED:
    case NO_USER_FOUND:
      return {
        ...initialState,
        error: action.error
      }
    //logging user out
    case USER_LOGGING_OUT_REQUEST:
      return {
        ...state,
        isLoggingOut: action.isLoading
      }
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case USER_LOGGING_OUT_REQUEST_FAILED:
      return {
        ...state,
        isLoggingOut: action.isLoading,
        error: action.error
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
