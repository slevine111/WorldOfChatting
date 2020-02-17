import { ADD_POSTPONNED_ACTION } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { User } from '../../../entities'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { AuthActionTypes } from './actions'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
const {
  CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS,
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS,
  REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export interface IAuthReducerState {
  user: User
  accessTokenExpireTime: number
  postponnedActions: IThunkReturnObject[]
}

const initialState: IAuthReducerState = {
  user: {} as User,
  accessTokenExpireTime: Number.POSITIVE_INFINITY,
  postponnedActions: []
}

export default (
  state: IAuthReducerState = initialState,
  action: AuthActionTypes | SharedActionsTypes
): IAuthReducerState => {
  switch (action.type) {
    //authenticating user
    case CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS:
    case AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS:
      return {
        user: action.user,
        accessTokenExpireTime: action.tokenExpireTime,
        postponnedActions: initialState.postponnedActions
      }
    //refreshing token
    case REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS:
      return {
        ...state,
        accessTokenExpireTime: action.accessTokenExpireTime
      }
    //logging user out
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...initialState }
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
