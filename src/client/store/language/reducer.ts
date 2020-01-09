import { Language } from '../../../entities'
import { LanguageActionReturns } from './actions'
import {
  RequestDataConstants,
  ENTERED_SITE_BASE_DATA_RECEIVED
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
const { ENTERED_SITE_LOADING_BASE_DATA_REQUEST } = RequestDataConstants

export interface ILanguageReducerState {
  data: Language[]
  isLoading: boolean
}

const initialState: ILanguageReducerState = { data: [], isLoading: false }

export default (
  state: ILanguageReducerState = initialState,
  action: LanguageActionReturns | SharedActionsTypes
): ILanguageReducerState => {
  switch (action.type) {
    case ENTERED_SITE_LOADING_BASE_DATA_REQUEST:
      return { data: [], isLoading: action.isLoading }
    case ENTERED_SITE_BASE_DATA_RECEIVED:
      return { data: action.languages, isLoading: action.isLoading }
    default:
      return state
  }
}
