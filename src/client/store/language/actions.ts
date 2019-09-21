import axios, { AxiosResponse } from 'axios'
import { Language } from '../../../entities'
import { GET_ALL_LANGUAGES, IGetAllLanguagesAction } from './types'
import { ThunkAction } from 'redux-thunk'

const getAllLanguages = (languages: Language[]): IGetAllLanguagesAction => ({
  type: GET_ALL_LANGUAGES,
  languages
})

export const getAllLanguagesThunk = (): ThunkAction<
  Promise<void>,
  Language[],
  null,
  IGetAllLanguagesAction
> => {
  return (dispatch): Promise<void> => {
    return axios
      .get('/api/language')
      .then(({ data }: AxiosResponse<Language[]>): void => {
        dispatch(getAllLanguages(data))
      })
  }
}
