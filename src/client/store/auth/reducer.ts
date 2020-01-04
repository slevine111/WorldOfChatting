import * as types from './types'
import { LOGOUT_USER_PROCESS, LogoutUserProcessType } from '../shared-actions'
import { AuthActionTypes } from './actions'

const initialState: types.IAuthReducerState = {
  user: {} as types.IAuthReducerUserField,
  accessTokenFields: { status: 'NONE', expireTime: Number.POSITIVE_INFINITY },
  postponnedActions: []
}

export default (
  state: types.IAuthReducerState = initialState,
  action: AuthActionTypes | LogoutUserProcessType
): types.IAuthReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
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
