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
import { separateUserAndChatGroupFields } from './helperfunctions'
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import {
  IUserLangugeWithOnlineUserCount,
  IChatGroupReducer,
  IUserAndChatGroupGetReturn
} from '../../../shared-types'
import { User } from '../../../entities'
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
    dispatchActionOnSuccess: logoutUserProcess,
    dispatchProps: {},
    bypassRefreshTokenMiddleware: true
  }
}

type UserLoggedInDataTransformationInput = [
  IChatGroupReducer,
  IUserLangugeWithOnlineUserCount[],
  IUserAndChatGroupGetReturn[]
]

export const userLoggedInThunk = (
  user: User
): IThunkReturnObject<UserLoggedInDataRetrivalArrayDataTypes> => {
  return {
    requestDataActionType: RequestDataConstants.REQUEST_DATA_USER_LOGGED_IN,
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
    dispatchActionOnSuccess: wentToLanguagePageView,
    dispatchProps: {}
  }
}
