import {
  USER_LOGGING_IN_FOUND,
  ACCESS_TOKEN_REFRESHED,
  ADD_POSTPONNED_ACTION
} from './types'
import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  RequestDataConstants
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { AuthActionTypes } from './actions'
import { IAuthReducerUserField } from './types'
import { IThunkReturnObject } from '../apiMiddleware'
const {
  REQUEST_DATA_USER_LOGGED_IN,
  AUTHENTICATING_USER_REQUEST,
  REFRESHING_ACCESS_TOKEN_REQUEST
} = RequestDataConstants

export interface IAuthReducerState {
  user: IAuthReducerUserField
  accessTokenFields: {
    isLoading: boolean
    expireTime: number
  }

  postponnedActions: IThunkReturnObject[]
  isLoading: boolean
  isLoadingUser: boolean
}

const initialState: IAuthReducerState = {
  user: {} as IAuthReducerUserField,
  accessTokenFields: {
    isLoading: false,
    expireTime: Number.POSITIVE_INFINITY
  },
  postponnedActions: [],
  isLoading: false,
  isLoadingUser: false
}

export default (
  state: IAuthReducerState = initialState,
  action: AuthActionTypes | SharedActionsTypes
): IAuthReducerState => {
  switch (action.type) {
    //authenticating user
    case AUTHENTICATING_USER_REQUEST:
      return { ...initialState, isLoadingUser: action.isLoading }
    case USER_LOGGING_IN_FOUND:
      let { data } = action
      return {
        user: { ...data.user, languages: [] },
        accessTokenFields: {
          isLoading: state.accessTokenFields.isLoading,
          expireTime: data.expireTime
        },
        postponnedActions: [],
        isLoading: false,
        isLoadingUser: action.isLoading
      }
    //after user has logged in
    case REQUEST_DATA_USER_LOGGED_IN:
      return {
        ...state,
        user: { ...state.user, languages: [] },
        isLoading: action.isLoading
      }
    case USER_LOGGED_IN:
      return {
        ...state,
        user: action.loggedInUserWithLanguagesArray,
        isLoading: action.isLoading
      }
    //refreshing token
    case REFRESHING_ACCESS_TOKEN_REQUEST:
      return {
        ...state,
        accessTokenFields: {
          isLoading: action.isLoading,
          expireTime: Number.POSITIVE_INFINITY
        }
      }
    case ACCESS_TOKEN_REFRESHED:
      return {
        ...state,
        accessTokenFields: {
          isLoading: action.isLoading,
          expireTime: action.accessTokenExpireTime
        }
      }
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
