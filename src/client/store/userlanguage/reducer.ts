import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserLanguage } from '../../../entities'
import { IUserLangugeWithOnlineUserCount } from '../../../types-for-both-server-and-client'
import { IBaseReducer } from '../reducer.base'
const {
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST,
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST
} = RequestDataConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const {
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE,
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE
} = RequestDataFailureConstants

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
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST:
      return {
        ofUser: { ...initialState.ofUser, isLoading: action.isLoading },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return {
        ofUser: {
          data: action.userLangsOfLoggedInUser,
          isLoading: action.isLoading,
          error: action.error
        },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE:
      return {
        ofUser: { ...initialState.ofUser, error: action.error },
        ofLanguagePage: { ...initialState.ofLanguagePage }
      }
    //after user clicks on language page
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: {
          ...initialState.ofLanguagePage,
          isLoading: action.isLoading
        }
      }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: {
          data: action.userLanguages,
          isLoading: action.isLoading,
          error: action.error
        }
      }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE:
      return {
        ofUser: { ...state.ofUser },
        ofLanguagePage: {
          ...initialState.ofLanguagePage,
          error: action.error
        }
      }
    //logging out
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}
