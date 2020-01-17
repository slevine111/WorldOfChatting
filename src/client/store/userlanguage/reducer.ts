import {
  LOGOUT_USER_PROCESS,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  USER_LOGGED_IN,
  RequestDataConstants,
  OnApiFailureActionTypes
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserLanguage } from '../../../entities'
import { IUserLangugeWithOnlineUserCount } from '../../../shared-types'
import { IBaseReducer } from '../reducer.base'
const { REQUEST_DATA_API, REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants
const {
  REQUEST_DATA_API_FAILED,
  REQUEST_DATA_USER_LOGGED_IN_FAILED,
  USER_LOGGING_OUT_REQUEST_FAILED,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILED
} = OnApiFailureActionTypes

export type IUserLoggedInLanguagesDataSlice = IBaseReducer<
  IUserLangugeWithOnlineUserCount[]
>

export type IUserLanguagesOfSingleLanguageDataSlice = IBaseReducer<
  UserLanguage[]
>

export interface IUserLangugeReducerState {
  ofUser: IUserLoggedInLanguagesDataSlice
  ofLanguagePage: IUserLanguagesOfSingleLanguageDataSlice
}

const initialState: IUserLangugeReducerState = {
  ofUser: { data: [], isLoading: false, error: null },
  ofLanguagePage: { data: [], isLoading: false, error: null }
}

export default (
  state: IUserLangugeReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserLangugeReducerState => {
  switch (action.type) {
    //user logging in
    case REQUEST_DATA_USER_LOGGED_IN:
      return {
        ofUser: { ...initialState.ofUser, isLoading: action.isLoading },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    case USER_LOGGED_IN:
      return {
        ofUser: {
          data: action.userLangsOfLoggedInUser,
          isLoading: action.isLoading,
          error: action.error
        },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    case REQUEST_DATA_USER_LOGGED_IN_FAILED:
      return {
        ofUser: { ...initialState.ofUser, error: action.error },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    //after user clicks on language page
    case REQUEST_DATA_API:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: {
          ...initialState.ofLanguagePage,
          isLoading: action.isLoading
        }
      }
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: {
          data: action.userLanguages,
          isLoading: action.isLoading,
          error: action.error
        }
      }
    case REQUEST_DATA_API_FAILED:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: {
          ...initialState.ofLanguagePage,
          error: action.error
        }
      }
    //logging out
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILED:
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case USER_LOGGING_OUT_REQUEST_FAILED:
    default:
      return state
  }
}
