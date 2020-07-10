import { User } from '../../../../entities'
import { IThunkReturnObject } from '../store.types'
import {
  ACTION_TYPES as API_MIDDLEWARE_ACTION_TYPES,
  PostponnedActionAddAR,
  AccessTokenRefreshedAR,
} from '../middleware/api/actions'
import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  LoggedInUserFoundEnteringSiteAR,
} from '../../../app/actions'
import {
  REQUEST_SUCCESS_ACTION_TYPES as NAVBAR_ACTION_TYPES,
  UserLoggedOutAR,
} from '../../../Navbar/actions'
import {
  AUTHENTICATING_USER_LOGIN_REQUEST_SUCCESS,
  UserLoginSucceededAR,
} from '../../../Login_Signup/Login/actions'

export interface AuthReducerState {
  user: User
  accessTokenExpireTime: number
  postponnedActions: IThunkReturnObject[]
}

export const authInitialState: AuthReducerState = {
  user: {} as User,
  accessTokenExpireTime: Number.POSITIVE_INFINITY,
  postponnedActions: [],
}

type ActionReturns =
  | PostponnedActionAddAR
  | AccessTokenRefreshedAR
  | LoggedInUserFoundEnteringSiteAR
  | UserLoginSucceededAR
  | UserLoggedOutAR

export const authReducer = (
  state: AuthReducerState = authInitialState,
  action: ActionReturns
): AuthReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS:
    case AUTHENTICATING_USER_LOGIN_REQUEST_SUCCESS:
      return {
        user: action.user,
        accessTokenExpireTime: action.tokenExpireTime,
        postponnedActions: authInitialState.postponnedActions,
      }
    case API_MIDDLEWARE_ACTION_TYPES.REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS:
      return {
        ...state,
        accessTokenExpireTime: action.accessTokenExpireTime,
      }
    case NAVBAR_ACTION_TYPES.USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...authInitialState }
    case API_MIDDLEWARE_ACTION_TYPES.ADD_POSTPONNED_ACTION:
      return {
        ...state,
        postponnedActions: [
          ...state.postponnedActions,
          action.postponnedAction,
        ],
      }
    default:
      return state
  }
}
