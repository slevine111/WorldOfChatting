import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserLanguage } from '../../../entities'
import { IBaseReducerTwo, INormalizedReducerShape } from '../reducer.base'
import { normalizeData } from '../utilityfunctions'
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

export const LOGGED_IN_USER_SUBGROUPING_KEY = <const>'loggedInUser'

export type IUserLanguageNormalizedShape = INormalizedReducerShape<UserLanguage>

export type IUserLanguageReducerState = IBaseReducerTwo<
  IUserLanguageNormalizedShape
>

const initialState: IUserLanguageReducerState = {
  data: {
    byId: {},
    allIds: [],
    subGroupings: { [LOGGED_IN_USER_SUBGROUPING_KEY]: [] }
  },
  isLoading: false,
  error: null
}

export default (
  state: IUserLanguageReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserLanguageReducerState => {
  switch (action.type) {
    //user logging in
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST:
      return { ...initialState, isLoading: action.isLoading }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return {
        data: normalizeData(action.userLangsOfLoggedInUser, {
          subGroupingKey: LOGGED_IN_USER_SUBGROUPING_KEY
        }),
        isLoading: action.isLoading,
        error: action.error
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE:
      return { ...initialState, error: action.error }
    //after user clicks on language page
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST:
      return { ...state, isLoading: action.isLoading }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, isLoading, error, userLanguages } = action
      return {
        data: normalizeData(userLanguages, {
          subGroupingKey: language,
          currentNormalizedData: state.data
        }),
        isLoading,
        error
      }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE:
      return { ...state, error: action.error }
    //logging out
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}
