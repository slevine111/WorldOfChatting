import { Language } from '../../../entities'
import { LanguageActionReturns } from './actions'
import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { IBaseReducer } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
const { ENTERED_SITE_LOADING_BASE_DATA_REQUEST } = RequestDataConstants
const {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILURE,
  USER_LOGGING_OUT_REQUEST_FAILURE
} = RequestDataFailureConstants

export type ILanguageReducerState = IBaseReducer<Language[]>

const initialState: ILanguageReducerState = {
  data: [],
  isLoading: false,
  error: null
}

export default (
  state: ILanguageReducerState = initialState,
  action: LanguageActionReturns | SharedActionsTypes
): ILanguageReducerState => {
  switch (action.type) {
    case ENTERED_SITE_LOADING_BASE_DATA_REQUEST:
      return { ...initialState, isLoading: action.isLoading }
    case ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS:
      return {
        data: action.languages,
        isLoading: action.isLoading,
        error: action.error
      }
    case ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILURE:
      return { ...initialState, error: action.error }
    case USER_LOGGING_OUT_REQUEST_FAILURE:
    default:
      return state
  }
}
