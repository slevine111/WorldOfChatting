import {
  LOGOUT_USER_PROCESS,
  WENT_TO_LANGUAGE_PAGE_VIEW
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserLanguage } from '../../../entities'

export default (
  state: UserLanguage[] = [],
  action: SharedActionsTypes
): UserLanguage[] => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return []
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      return action.userLanguages
    default:
      return state
  }
}
