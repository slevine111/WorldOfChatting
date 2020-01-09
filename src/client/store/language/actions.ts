import axios, { AxiosResponse } from 'axios'
import { Language } from '../../../entities'
import { IThunkReturnObject } from '../apiMiddleware'
import {
  RequestDataConstants,
  ENTERED_SITE_BASE_DATA_RECEIVED
} from '../shared/types'
const { ENTERED_SITE_LOADING_BASE_DATA_REQUEST } = RequestDataConstants

const gotAllLanguages = (languages: Language[], isLoading: boolean) => ({
  type: ENTERED_SITE_BASE_DATA_RECEIVED,
  languages,
  isLoading
})
type GotAllLanguagesActionReturn = ReturnType<typeof gotAllLanguages>

export type LanguageActionReturns = GotAllLanguagesActionReturn

export const getAllLanguagesThunk = (): IThunkReturnObject<Language[]> => {
  return {
    requestDataActionType: ENTERED_SITE_LOADING_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse<Language[]>> => {
      return axios.get('/api/language')
    },
    dispatchAction: gotAllLanguages,
    dispatchProps: {}
  }
}
