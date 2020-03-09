import axios, { AxiosResponse } from 'axios'
import { Language } from '../../../entities'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import {
  RequestDataConstants,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
const { ENTERED_SITE_LOADING_BASE_DATA_REQUEST } = RequestDataConstants

const gotAllLanguages = (languages: Language[]) => ({
  type: <const>(
    RequestDataSuccessConstants.ENTERED_SITE_LOADING_BASE_DATA_REQUEST_SUCCESS
  ),
  languages
})

export type LanguageActionReturns = ReturnType<typeof gotAllLanguages>

export const getAllLanguagesThunk = (): IThunkReturnObject<Language[]> => {
  return {
    requestDataActionType: ENTERED_SITE_LOADING_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse<Language[]>> => {
      return axios.get('/api/language')
    },
    dispatchActionOnSuccess: gotAllLanguages,
    dispatchProps: {}
  }
}
