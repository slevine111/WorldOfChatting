import { UserLanguage } from '../../../entities'
import { IUserFieldsForStore } from '../../../shared-types'
import axios, { AxiosResponse } from 'axios'
import { setCurrentLanguageUsers } from '../../store/user/actions'
import { setUserLanguages } from '../../store/userlanguage/actions'

export const languagePageDataRetrival = (language: string) => {
  return async (dispatch: any) => {
    const [userLanguages, users]: [
      AxiosResponse<UserLanguage[]>,
      AxiosResponse<IUserFieldsForStore[]>
    ] = await Promise.all([
      axios.get(`/api/userlanguage/language/${language}`),
      axios.get(`/api/user/linked/language/${language}`)
    ])
    dispatch(setUserLanguages(userLanguages.data))
    dispatch(setCurrentLanguageUsers(users.data))
  }
}
