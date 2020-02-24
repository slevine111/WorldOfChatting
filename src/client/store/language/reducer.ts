import { Language } from '../../../entities'
import { LanguageActionReturns } from './actions'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { INormalizedReducerShape } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { normalizeData, createInitialState } from '../utilityfunctions'
const {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type ILanguageReducerState = INormalizedReducerShape<Language>

export default (
  state: ILanguageReducerState = createInitialState(),
  action: LanguageActionReturns | SharedActionsTypes
): ILanguageReducerState => {
  switch (action.type) {
    case ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.languages, state, { dataItemKey: 'language' })
    default:
      return state
  }
}
