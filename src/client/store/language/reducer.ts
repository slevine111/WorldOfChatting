import { Language } from '../../../entities'
import { LanguageActionReturns } from './actions'
import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { IBaseReducer, INormalizedReducerShape } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { normalizeData } from '../utilityfunctions'
const { ENTERED_SITE_LOADING_BASE_DATA_REQUEST } = RequestDataConstants
const {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILURE,
  USER_LOGGING_OUT_REQUEST_FAILURE
} = RequestDataFailureConstants

export type ILanguageNormalizedShape = INormalizedReducerShape<Language>

export type ILanguageReducerState = IBaseReducer<ILanguageNormalizedShape>

const initialState: ILanguageReducerState = {
  data: { byId: {}, allIds: [], subGroupings: {} },
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
        data: normalizeData(action.languages, { dataItemKey: 'language' }),
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
