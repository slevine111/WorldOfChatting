import { SET_USER_LANGUAGES } from './types'
import { UserLanguage } from '../../../entities'

export const setUserLanguages = (userLanguges: UserLanguage[]) => ({
  type: SET_USER_LANGUAGES,
  userLanguges
})
type SetUserLanguagesType = ReturnType<typeof setUserLanguages>

export type UserLanguageActionTypes = SetUserLanguagesType
