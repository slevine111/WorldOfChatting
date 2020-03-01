import {
  userLoggedOut,
  userLoggedIn,
  wentToLanguagePageView,
  chatGroupRequestAccepted
} from './multiplereduceractions'
import {
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataRetrivalArrayDataTypes,
  IChatGroupRequestAcceptedData,
  RequestDataConstants,
  IThunkReturnObject
} from './types'
import { separateUserAndChatGroupFields } from './helperfunctions'
import { normalizeData, createInitialState } from '../utilityfunctions'
import {
  generateInitNotficationSubGroupingFunction,
  NOTIFICATIONS_DISPLAY
} from '../notification/helperfunctions'
import { IUserReducerState } from '../user/reducer'
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import { IChatGroupPostDTO } from '../../../server/chatgroups/chatgroups.dto'
import { IUserChatGroupPostDTO } from '../../../server/userchatgroups/userchatgroups.dto'
import {
  IChatGroupAPIReturn,
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields,
  INotificationReducerFields
} from '../../../types-for-both-server-and-client'
import { User, UserLanguage } from '../../../entities'
import { NtRecipientStatusOptions } from '../../../entities/NotificationRecipient'
import axios, { AxiosResponse } from 'axios'

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
      const usersNormalized: IUserReducerState = normalizeData(
        usersWhoSentNotifications,
        createInitialState()
      )
      const {
        usersNormalizedAll,
        userChatGroupNormalized
      } = separateUserAndChatGroupFields(usersNormalized, usersWithChatGroups)
      const notificationsInitialState = createInitialState<
        INotificationReducerFields
      >(NOTIFICATIONS_DISPLAY)
      const notificationsNormalized = normalizeData(
        notifications,
        notificationsInitialState,
        {
          subGroupingFunction: generateInitNotficationSubGroupingFunction(
            user.id
          )
        }
      )

      return [
        userLangsOfLoggedInUser,
        chatGroups,
        usersNormalizedAll,
        userChatGroupNormalized,
        notificationsNormalized
      ]
    },
    dispatchActionOnSuccess: userLoggedIn,
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
    dispatchProps: {}
  }
}

export const chatGroupRequestAcceptedThunk = (
  ntRecipientId: string,
  newChatGroup: IChatGroupPostDTO,
  userIdsOfChatGroup: string[]
): IThunkReturnObject<IChatGroupRequestAcceptedData> => {
  return {
    requestDataActionType:
      RequestDataConstants.CHAT_GROUP_INVITE_ACCEPTED_REQUEST,

    apiCall: async (): Promise<IChatGroupRequestAcceptedData> => {
      const { data }: AxiosResponse<IChatGroupAPIReturn> = await axios.post(
        '/api/chatgroup',
        newChatGroup
      )
      const newUserChatGroupsSubset: IUserChatGroupPostDTO[] = userIdsOfChatGroup.map(
        id => ({ userId: id, chatGroupId: data.id })
      )
      const apiReturn = await Promise.all([
        axios.post('/api/userchatgroup', newUserChatGroupsSubset),
        axios.put(`api/notification/notificationRecipient/${ntRecipientId}`, {
          status: NtRecipientStatusOptions.ACCEPTED
        })
      ])
      return {
        newChatGroup: data,
        newUserChatGroups: apiReturn[0].data,
        updatedNotification: apiReturn[1].data
      }
    },

    dispatchActionOnSuccess: chatGroupRequestAccepted
  }
}
