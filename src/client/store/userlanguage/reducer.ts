import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserLanguage } from '../../../entities'
import { INormalizedReducerShape } from '../reducer.base'
import { normalizeData, createInitialState } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export const LOGGED_IN_USER_SUBGROUPING_KEY = <const>'loggedInUser'

export type IUserLanguageReducerState = INormalizedReducerShape<UserLanguage>

export default (
  state: IUserLanguageReducerState = createInitialState(
    LOGGED_IN_USER_SUBGROUPING_KEY
  ),
  action: SharedActionsTypes
): IUserLanguageReducerState => {
  switch (action.type) {
    //user logging in
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.userLanguages, state, {
        subGroupingKey: LOGGED_IN_USER_SUBGROUPING_KEY
      })
    //after user clicks on language page
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, userLanguages } = action
      return normalizeData(userLanguages, state, {
        subGroupingKey: language
      })
    default:
      return state
  }
}
