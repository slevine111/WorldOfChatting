import { NO_DIRECT_CHAT_WITH_KEY } from './constants'
import { addIdToSubGroupingFromSimilarityScore } from './helperfunctions'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { INormalizedReducerShape } from '../reducer.base'
import { normalizeData, createInitialState } from '../utilityfunctions'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS,
} = RequestDataSuccessConstants

export type IUserReducerState = INormalizedReducerShape<IReduxStoreUserFields>

export default (
  state: IUserReducerState = createInitialState(NO_DIRECT_CHAT_WITH_KEY),
  action: SharedActionsTypes
): IUserReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.users, state, {
        subGroupingFunction: addIdToSubGroupingFromSimilarityScore,
      })
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, users } = action
      return normalizeData(users, state, {
        subGroupingKey: language,
      })
    default:
      return state
  }
}
