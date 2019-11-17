import { Language } from '../../../entities'
import { SET_LANGUAGES } from './types'
import { LanguageActionTypes } from './actions'

export default (
  state: Language[] = [],
  action: LanguageActionTypes
): Language[] => {
  switch (action.type) {
    case SET_LANGUAGES:
      return [...action.languages]
    default:
      return state
  }
}
