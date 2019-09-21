import { Language } from '../../../entities'

export const GET_ALL_LANGUAGES: string = 'GET_ALL_LANGUAGES'

export interface IGetAllLanguagesAction {
  type: typeof GET_ALL_LANGUAGES
  languages: Language[]
}

export type LanguageActionTypes = IGetAllLanguagesAction
