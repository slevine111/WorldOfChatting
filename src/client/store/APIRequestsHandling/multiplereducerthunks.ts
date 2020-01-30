import {
  userLoggedOut,
  userLoggedIn,
  wentToLanguagePageView
} from './multiplereduceractions'
import {
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataRetrivalArrayDataTypes,
  RequestDataConstants,
  RequestDataFailureConstants
} from './types'
import { separateUserAndChatGroupFields } from './helperfunctions'
import { normalizeData } from '../utilityfunctions'
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import {
  IChatGroupAPIReturn,
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields,
  INotificationReducerFields
} from '../../../types-for-both-server-and-client'
import { INormalizedReducerShape } from '../reducer.base'
import { User, UserLanguage } from '../../../entities'
import axios, { AxiosResponse } from 'axios'
import { IThunkReturnObject } from './types'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE,
  USER_LOGGING_OUT_REQUEST_FAILURE
} = RequestDataFailureConstants

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
    dispatchActionOnSuccess: userLoggedOut,
    apiFailureActionType: USER_LOGGING_OUT_REQUEST_FAILURE,
    dispatchProps: {},
    bypassRefreshTokenMiddleware: true
  }
}

type UserLoggedInDataTransformationInput = [
  IChatGroupAPIReturn[],
  UserLanguage[],
  IUserAndChatGroupGetReturn[],
  IReduxStoreUserFields[],
  INotificationReducerFields[]
]

export const userLoggedInDataRetrivalThunk = (
  user: User
): IThunkReturnObject<UserLoggedInDataRetrivalArrayDataTypes> => {
  return {
    requestDataActionType:
      RequestDataConstants.HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/chatgroup/${user.id}`),
        axios.get(`/api/userlanguage/linked/${user.id}`),
        axios.get(`/api/user/${user.id}/userslinked/withchatgroup`),
        axios.get(`/api/user/${user.id}/notifications/received`),
        axios.get(`/api/notification/${user.id}`)
      ])
    },
    dataTransformationCall: (
      apiResponseData: UserLoggedInDataTransformationInput
    ): UserLoggedInDataRetrivalArrayDataTypes => {
      const [
        chatGroups,
        userLangsOfLoggedInUser,
        usersWithChatGroups,
        usersWhoSentNotifications,
        notifications
      ] = apiResponseData
      const usersNormalized: INormalizedReducerShape<IReduxStoreUserFields> = normalizeData(
        usersWhoSentNotifications
      )
      const {
        usersNormalizedAll,
        userChatGroupNormalized
      } = separateUserAndChatGroupFields(
        usersNormalized,
        usersWithChatGroups,
        user.id
      )
      return [
        userLangsOfLoggedInUser,
        chatGroups,
        usersNormalizedAll,
        userChatGroupNormalized,
        notifications
      ]
    },
    dispatchActionOnSuccess: userLoggedIn,
    apiFailureActionType: HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
    dispatchProps: {}
  }
}

type LangPageDataRetrivalTransformationInput = [
  UserLanguage[],
  IReduxStoreUserFields[]
]

export const languagePageDataRetrivalThunk = (
  language: string
): IThunkReturnObject<LanguagePageDataRetrivalArrayDataTypes> => {
  return {
    requestDataActionType:
      RequestDataConstants.WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/userlanguage/language/${language}`),
        axios.get(`/api/user/linked/language/${language}`)
      ])
    },
    dataTransformationCall: (
      apiResponseData: LangPageDataRetrivalTransformationInput
    ): LanguagePageDataRetrivalArrayDataTypes => {
      const [userLanguages, user] = apiResponseData
      return [userLanguages, user, language]
    },
    dispatchActionOnSuccess: wentToLanguagePageView,
    apiFailureActionType: WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE,
    dispatchProps: {}
  }
}
