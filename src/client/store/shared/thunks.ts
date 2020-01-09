import {
  logoutUserProcess,
  userLoggedIn,
  wentToLanguagePageView
} from './actions'
import {
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataRetrivalArrayDataTypes,
  RequestDataConstants
} from './types'
import {
  generateAuthReducerUserField,
  separateUserAndChatGroupFields
} from './helperfunctions'
import { IAuthReducerUserField } from '../auth/types'
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import {
  IUserCountByLanguage,
  ILanguageWithActiveAndTypeFields,
  IChatGroupReducer,
  IUserAndChatGroupGetReturn
} from '../../../shared-types'
import axios, { AxiosResponse } from 'axios'
import { IThunkReturnObject } from '../apiMiddleware'

export const logoutUserProcessThunk = (
  userId: string,
  partialUpdatedUser: IUserUpdateDTO
): IThunkReturnObject<[]> => {
  return {
    requestDataActionType: RequestDataConstants.USER_LOGGING_OUT_REQUEST,
    apiCall: async (): Promise<AxiosResponse> => {
      await axios.put(`/api/user/${userId}`, partialUpdatedUser)
      return axios.delete('/api/auth')
    },
    dispatchAction: logoutUserProcess,
    dispatchProps: {},
    bypassRefreshTokenMiddleware: true
  }
}

type UserLoggedInDataTransformationInput = [
  ILanguageWithActiveAndTypeFields[],
  IChatGroupReducer,
  IUserCountByLanguage[],
  IUserAndChatGroupGetReturn[]
]

export const userLoggedInThunk = (
  user: IAuthReducerUserField
): IThunkReturnObject<UserLoggedInDataRetrivalArrayDataTypes> => {
  return {
    requestDataActionType: RequestDataConstants.REQUEST_DATA_USER_LOGGED_IN,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/language/${user.id}`),
        axios.get(`/api/chatgroup/${user.id}`),
        axios.get(`/api/userlanguage/linked/${user.id}/countbylanguage`),
        axios.get(`/api/user/linked/${user.id}/withchatgroup`)
      ])
    },
    dataTransformationCall: (
      apiResponseData: UserLoggedInDataTransformationInput
    ): UserLoggedInDataRetrivalArrayDataTypes => {
      const [
        languages,
        chatGroups,
        userCountByLanguage,
        usersWithChatGroups
      ] = apiResponseData
      const { users, userChatGroups } = separateUserAndChatGroupFields(
        usersWithChatGroups,
        user.id
      )
      let userWithLanguagesArray: IAuthReducerUserField = generateAuthReducerUserField(
        user,
        languages,
        userCountByLanguage
      )
      return [userWithLanguagesArray, chatGroups, users, userChatGroups]
    },
    dispatchAction: userLoggedIn,
    dispatchProps: {}
  }
}

export const languagePageDataRetrivalThunk = (
  language: string
): IThunkReturnObject<LanguagePageDataRetrivalArrayDataTypes> => {
  return {
    requestDataActionType: RequestDataConstants.REQUEST_DATA_API,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/userlanguage/language/${language}`),
        axios.get(`/api/user/linked/language/${language}`)
      ])
    },
    dispatchAction: wentToLanguagePageView,
    dispatchProps: {}
  }
}
