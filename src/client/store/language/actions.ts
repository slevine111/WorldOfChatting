import axios, { AxiosResponse } from 'axios'
import { Language } from '../../../entities'
import { SET_LANGUAGES } from './types'
import { ThunkAction } from 'redux-thunk'

const setLanguages = (languages: Language[]) => ({
  type: SET_LANGUAGES,
  languages
})
type SetLanguagesType = ReturnType<typeof setLanguages>

export type LanguageActionTypes = SetLanguagesType

export const getAllLanguagesThunk = (): ThunkAction<
  Promise<void>,
  Language[],
  null,
  SetLanguagesType
> => {
  return (dispatch): Promise<void> => {
    return axios
      .get('/api/language')
      .then(({ data }: AxiosResponse<Language[]>): void => {
        dispatch(setLanguages(data))
      })
  }
}
