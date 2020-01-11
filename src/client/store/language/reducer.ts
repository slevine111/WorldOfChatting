import { Language } from '../../../entities'
import { LanguageActionReturns } from './actions'
import {
  RequestDataConstants,
  OnApiFailureActionTypes,
  ENTERED_SITE_BASE_DATA_RECEIVED
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { IAxiosErrorData } from '../apiMiddleware'
const { ENTERED_SITE_LOADING_BASE_DATA_REQUEST } = RequestDataConstants
const {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILED,
  USER_LOGGING_OUT_REQUEST_FAILED
} = OnApiFailureActionTypes

export interface ILanguageReducerState {
  data: Language[]
  isLoading: boolean
  error: null | IAxiosErrorData
}

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
    case ENTERED_SITE_BASE_DATA_RECEIVED:
      return {
        data: action.languages,
        isLoading: action.isLoading,
        error: action.error
      }
    case ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILED:
      return { ...initialState, error: action.error }
    case USER_LOGGING_OUT_REQUEST_FAILED:
    default:
      return state
  }
}
