import * as types from './types'
import { LOGOUT_USER_PROCESS, USER_LOGGED_IN } from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { AuthActionTypes } from './actions'
import { AnyAction } from 'redux'
import { PossibleStatuses, IAuthReducerUserField } from './types'

interface IAccessTokenFields {
  status: PossibleStatuses
  expireTime: number
}

export interface IAuthReducerState {
  user: IAuthReducerUserField
  accessTokenFields: IAccessTokenFields
  postponnedActions: AnyAction[]
}

const initialState: types.IAuthReducerState = {
  user: {} as IAuthReducerUserField,
  accessTokenFields: {
    status: PossibleStatuses.NONE,
    expireTime: Number.POSITIVE_INFINITY
  },
  postponnedActions: []
}

export default (
  state: types.IAuthReducerState = initialState,
  action: AuthActionTypes | SharedActionsTypes
): types.IAuthReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case USER_LOGGED_IN:
      return {
        ...state,
        user: action.loggedInUserWithLanguagesArray
      }
    case types.SET_TO_INITIAL_STATE:
      return initialState
    case types.SET_STATUS:
      return {
        ...state,
        accessTokenFields: { ...state.accessTokenFields, status: action.status }
      }
    case types.SET_ACCESS_TOKEN_FIELDS:
      return { ...state, accessTokenFields: action.accessTokenFields }
    case types.SET_USER_AND_ACCESS_TOKEN_FIELDS:
      return {
        ...state,
        user: action.user,
        accessTokenFields: action.accessTokenFields
      }
    case types.ADD_POSTPONNED_ACTION:
      return {
        ...state,
        postponnedActions: [...state.postponnedActions, action.postponnedAction]
      }
    default:
      return state
  }
}
