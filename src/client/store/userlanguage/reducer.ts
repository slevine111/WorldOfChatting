import {
  LOGOUT_USER_PROCESS,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  USER_LOGGED_IN,
  RequestDataConstants
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserLanguage } from '../../../entities'
import { IUserLangugeWithOnlineUserCount } from '../../../shared-types'
const { REQUEST_DATA_API, REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants

export interface IUserLangugeReducerState {
  ofUser: { data: IUserLangugeWithOnlineUserCount[]; isLoading: boolean }
  ofLanguagePage: { data: UserLanguage[]; isLoading: boolean }
}

const initialState: IUserLangugeReducerState = {
  ofUser: { data: [], isLoading: false },
  ofLanguagePage: { data: [], isLoading: false }
}

export default (
  state: IUserLangugeReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserLangugeReducerState => {
  switch (action.type) {
    //user logging in
    case REQUEST_DATA_USER_LOGGED_IN:
      return {
        ofUser: { data: [], isLoading: action.isLoading },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    case USER_LOGGED_IN:
      return {
        ofUser: {
          data: action.userLangsOfLoggedInUser,
          isLoading: action.isLoading
        },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    //after user clicks on language page
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: {
          data: action.userLanguages,
          isLoading: action.isLoading
        }
      }
    case REQUEST_DATA_API:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: { data: [], isLoading: action.isLoading }
      }
    //logging out
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    default:
      return state
  }
}
