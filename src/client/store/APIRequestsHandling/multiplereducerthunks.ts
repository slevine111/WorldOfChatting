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
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import {
  IUserLangugeWithOnlineUserCount,
  IChatGroupReducer,
  IUserAndChatGroupGetReturn
} from '../../../types-for-both-server-and-client'
import { User } from '../../../entities'
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
  IChatGroupReducer,
  IUserLangugeWithOnlineUserCount[],
  IUserAndChatGroupGetReturn[]
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
        axios.get(`/api/user/linked/${user.id}/withchatgroup`)
      ])
    },
    dataTransformationCall: (
      apiResponseData: UserLoggedInDataTransformationInput
    ): UserLoggedInDataRetrivalArrayDataTypes => {
      const [
        chatGroups,
        userLangsOfLoggedInUser,
        usersWithChatGroups
      ] = apiResponseData
      const { users, userChatGroups } = separateUserAndChatGroupFields(
        usersWithChatGroups,
        user.id
      )
      return [userLangsOfLoggedInUser, chatGroups, users, userChatGroups]
    },
    dispatchActionOnSuccess: userLoggedIn,
    apiFailureActionType: HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
    dispatchProps: {}
  }
}

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
    dispatchActionOnSuccess: wentToLanguagePageView,
    apiFailureActionType: WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE,
    dispatchProps: {}
  }
}
