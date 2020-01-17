import axios, { AxiosResponse } from 'axios'
import { Language } from '../../../entities'
import { IThunkReturnObject } from '../apiMiddleware'
import {
  RequestDataConstants,
  OnApiFailureActionTypes,
  ENTERED_SITE_BASE_DATA_RECEIVED
} from '../APIRequestsHandling/types'
const { ENTERED_SITE_LOADING_BASE_DATA_REQUEST } = RequestDataConstants
const {
  ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILED
} = OnApiFailureActionTypes

const gotAllLanguages = (
  languages: Language[],
  isLoading: boolean,
  error: null
) => ({
  type: ENTERED_SITE_BASE_DATA_RECEIVED,
  languages,
  isLoading,
  error
})
type GotAllLanguagesActionReturn = ReturnType<typeof gotAllLanguages>

export type LanguageActionReturns = GotAllLanguagesActionReturn

export const getAllLanguagesThunk = (): IThunkReturnObject<Language[]> => {
  return {
    requestDataActionType: ENTERED_SITE_LOADING_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse<Language[]>> => {
      return axios.get('/api/language')
    },
    dispatchActionOnSuccess: gotAllLanguages,
    apiFailureActionType: ENTERED_SITE_LOADING_BASE_DATA_REQUEST_FAILED,
    dispatchProps: {}
  }
}
