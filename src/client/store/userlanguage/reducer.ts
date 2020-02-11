import {
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserLanguage } from '../../../entities'
import { INormalizedReducerShape } from '../reducer.base'
import { normalizeData } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const { REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE } = RequestDataFailureConstants

export const LOGGED_IN_USER_SUBGROUPING_KEY = <const>'loggedInUser'

export type IUserLanguageReducerState = INormalizedReducerShape<UserLanguage>

const initialState: IUserLanguageReducerState = {
  byId: {},
  allIds: [],
  subGroupings: { [LOGGED_IN_USER_SUBGROUPING_KEY]: [] }
}

export default (
  state: IUserLanguageReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserLanguageReducerState => {
  switch (action.type) {
    //user logging in
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.userLangsOfLoggedInUser, {
        subGroupingKey: LOGGED_IN_USER_SUBGROUPING_KEY
      })
    //after user clicks on language page
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, userLanguages } = action
      return normalizeData(userLanguages, {
        subGroupingKey: language,
        currentNormalizedData: state
      })
    //logging out
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}
