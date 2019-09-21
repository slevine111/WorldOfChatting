import { Language } from '../../../entities'
import { GET_ALL_LANGUAGES, LanguageActionTypes } from './types'

export default (
  state: Language[] = [],
  action: LanguageActionTypes
): Language[] => {
  switch (action.type) {
    case GET_ALL_LANGUAGES:
      return [...action.languages]
    default:
      return state
  }
}
