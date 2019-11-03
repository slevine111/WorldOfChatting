import { CREATE_NEW_USER_LANGUAGES, SET_USER_LANGUAGES } from './types'
import { UserLanguage } from '../../../entities'
import axios, { AxiosResponse } from 'axios'
import { ThunkAction } from 'redux-thunk'

const setUserLanguages = (userLanguges: UserLanguage[]) => ({
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

export const setUserLanguagesLinkedToOneUser = (
  userId: string
): ThunkAction<Promise<void>, UserLanguage[], string, SetUserLanguagesType> => {
  return dispatch => {
    return axios
      .get(`/api/userlanguage/linked/${userId}`)
      .then(({ data }: AxiosResponse<UserLanguage[]>) => {
        dispatch(setUserLanguages(data))
      })
  }
}
