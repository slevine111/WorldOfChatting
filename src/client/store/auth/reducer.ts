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
  REFRESHING_ACCESS_TOKEN_REQUEST
} = RequestDataConstants
const {
  NO_USER_FOUND,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILED
} = OnApiFailureActionTypes

export interface IAuthReducerState {
  user: User
  tokenExpireTime: number
  error: null | IAxiosErrorData
  isLoading: boolean
  postponnedActions: IThunkReturnObject[]
}

const initialState: IAuthReducerState = {
  user: {} as User,
  tokenExpireTime: Number.POSITIVE_INFINITY,
  isLoading: false,
  error: null,

  postponnedActions: []
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
        isLoading: action.isLoading
      }
    case USER_LOGGING_IN_FOUND:
      let { data } = action
      return {
        user: data.user,
        tokenExpireTime: data.expireTime,
        isLoading: action.isLoading,
        error: action.error,
        postponnedActions: []
      }
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILED:
    case NO_USER_FOUND:
      return {
        ...initialState,
        error: action.error
      }
    //refreshing token
    case REFRESHING_ACCESS_TOKEN_REQUEST:
      return {
        user: state.user,
        tokenExpireTime: initialState.tokenExpireTime,
        isLoading: action.isLoading,
        error: initialState.error,
        postponnedActions: state.postponnedActions
      }
    case ACCESS_TOKEN_REFRESHED:
      return {
        user: state.user,
        tokenExpireTime: action.accessTokenExpireTime,
        isLoading: action.isLoading,
        error: action.error,
        postponnedActions: state.postponnedActions
      }
    //adding postponned action (when api call is made and token being refreshed)
    case ADD_POSTPONNED_ACTION:
      return {
        ...state,
        postponnedActions: [...state.postponnedActions, action.postponnedAction]
      }
    //logging user out
    case LOGOUT_USER_PROCESS:
      return { ...initialState }

    default:
      return state
  }
}
