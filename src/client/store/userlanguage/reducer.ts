import { SET_USER_LANGUAGES, CREATE_NEW_USER_LANGUAGES } from './types'
import { UserLanguageActionTypes } from './actions'
import { UserLanguage } from '../../../entities'

export default (
  state: UserLanguage[] = [],
  action: UserLanguageActionTypes
): UserLanguage[] => {
  switch (action.type) {
    case SET_USER_LANGUAGES:
      return action.userLanguges
    case CREATE_NEW_USER_LANGUAGES:
      return [...state, ...action.newUserLanguages]
    default:
      return state
  }
}
