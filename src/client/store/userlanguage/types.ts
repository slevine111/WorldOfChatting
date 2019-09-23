import { UserLanguage } from '../../../entities'

export const CREATE_NEW_USER_LANGUAGES: string = 'CREATE_NEW_USER_LANGUAGES'

export interface ICreateNewUserLanguagesAction {
  type: typeof CREATE_NEW_USER_LANGUAGES
  newUserLanguages: UserLanguage[]
}

export type UserLanguageActionTypes = ICreateNewUserLanguagesAction
