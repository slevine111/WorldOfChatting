import { Language } from '../../../../entities'
import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  GotAllLanguagesAR,
} from '../../../app/actions'
import { INormalizedReducerShape } from '../store.types'
import { normalizeData, createInitialState } from '../utilityfunctions'

export type LanguageReducerState = INormalizedReducerShape<Language>

export const languageInitialState: LanguageReducerState = createInitialState()

type ActionReturns = GotAllLanguagesAR

export const languageReducer = (
  state: LanguageReducerState = languageInitialState,
  action: ActionReturns
): LanguageReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.ENTERED_SITE_REQUEST_SUCCESS:
      return normalizeData(action.languages, state, {
        dataItemKey: 'language',
      })
    default:
      return state
  }
}
