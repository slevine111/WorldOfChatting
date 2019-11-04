import { CREATE_NEW_USER_LANGUAGES, SET_USER_LANGUAGES } from './types'
import { UserLanguage } from '../../../entities'

export const setUserLanguages = (userLanguges: UserLanguage[]) => ({
  type: SET_USER_LANGUAGES,
  userLanguges
})
type SetUserLanguagesType = ReturnType<typeof setUserLanguages>

export const createNewUserLanguages = (newUserLanguages: UserLanguage[]) => ({
  type: CREATE_NEW_USER_LANGUAGES,
  newUserLanguages
})
type CreateNewUserLanguagesType = ReturnType<typeof createNewUserLanguages>

export type UserLanguageActionTypes =
  | SetUserLanguagesType
  | CreateNewUserLanguagesType
