import { SET_USER_LANGUAGES } from './types'
import { UserLanguageActionTypes } from './actions'
import { LOGOUT_USER_PROCESS, LogoutUserProcessType } from '../shared-actions'
import { UserLanguage } from '../../../entities'

export default (
  state: UserLanguage[] = [],
  action: UserLanguageActionTypes | LogoutUserProcessType
): UserLanguage[] => {
  switch (action.type) {
    case SET_USER_LANGUAGES:
      return action.userLanguges
    case LOGOUT_USER_PROCESS:
      return []
    default:
      return state
  }
}
