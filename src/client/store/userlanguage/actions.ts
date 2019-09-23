import {
  CREATE_NEW_USER_LANGUAGES,
  ICreateNewUserLanguagesAction
} from './types'
import { UserLanguage } from '../../../entities'

export const createNewUserLanguages = (
  newUserLanguages: UserLanguage[]
): ICreateNewUserLanguagesAction => ({
  type: CREATE_NEW_USER_LANGUAGES,
  newUserLanguages
})
