import { CREATE_NEW_USER_LANGUAGES, UserLanguageActionTypes } from './types'
import { UserLanguage } from '../../../entities'

export default (
  state: UserLanguage[] = [],
  action: UserLanguageActionTypes
): UserLanguage[] => {
  switch (action.type) {
    case CREATE_NEW_USER_LANGUAGES:
      return [...state, ...action.newUserLanguages]
    default:
      return state
  }
}
