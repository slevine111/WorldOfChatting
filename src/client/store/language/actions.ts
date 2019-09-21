import axios, { AxiosResponse } from 'axios'
import { Language } from '../../../entities'
import { GET_ALL_LANGUAGES, IGetAllLanguagesAction } from './types'
import { Dispatch } from 'redux'

const getAllLanguages = (languages: Language[]): IGetAllLanguagesAction => ({
  type: GET_ALL_LANGUAGES,
  languages
})

export const getAllLanguagesThunk = (): ((
  dispatch: Dispatch
) => Promise<void>) => {
  return (dispatch: Dispatch): Promise<void> => {
    return axios
      .get('/api/language')
      .then(({ data }: AxiosResponse<Language[]>): void => {
        dispatch(getAllLanguages(data))
      })
  }
}
