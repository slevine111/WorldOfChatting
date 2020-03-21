import {
  userLoggedOut,
  userLoggedIn,
  wentToLanguagePageView,
  chatGroupRequestAccepted,
  chatGroupRequestDeclined
} from './multiplereduceractions'
import {
  LanguagePageDataRetrivalArrayDataTypes,
  IUserLoggedInDataRetrival,
  IChatGroupRequestAcceptedData,
  IChatGroupRequestBase,
  RequestDataConstants,
  IThunkReturnObject
} from './types'
import {
  separateUserAndChatGroupFields,
  respondToChatInviteBase
} from './helperfunctions'
import { normalizeData, createInitialState } from '../utilityfunctions'
import { IUserReducerState } from '../user/reducer'
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import { IChatGroupPostDTO } from '../../../server/chatgroups/chatgroups.dto'
import { IUserChatGroupPostDTO } from '../../../server/userchatgroups/userchatgroups.dto'
import {
  IChatGroupAPIReturn,
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields,
  IChatGroupInviteReducerFields
} from '../../../types-for-both-server-and-client'
import {
  User,
  UserLanguage,
  Notification,
  UserChatGroup
} from '../../../entities'
import { ChatGroupInviteStatusOptions } from '../../../entities/ChatGroupInviteRecipient'
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
  IChatGroupInviteReducerFields[],
  Notification[]
]

export const userLoggedInDataRetrivalThunk = (
  user: User
): IThunkReturnObject<IUserLoggedInDataRetrival> => {
  return {
    requestDataActionType:
      RequestDataConstants.HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/chatgroup/${user.id}`),
        axios.get(`/api/userlanguage/linked/${user.id}`),
        axios.get(`/api/user/${user.id}/userslinked/withchatgroup`),
        axios.get(`/api/user/${user.id}/notifications/received`),
        axios.get(`/api/chatgroupinvite/${user.id}`),
        axios.get(`/api/notification/${user.id}`)
      ])
    },
    dataTransformationCall: (
      apiResponseData: UserLoggedInDataTransformationInput
    ): IUserLoggedInDataRetrival => {
      const [
        chatGroups,
        userLanguages,
        usersWithChatGroups,
        usersWhoSentNotifications,
        chatGroupInvites,
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

      return {
        userLanguages,
        chatGroups,
        chatGroupInvites,
        notifications,
        users: usersNormalizedAll,
        userChatGroups: userChatGroupNormalized
      }
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
  newChatGroup: IChatGroupPostDTO,
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteRecipientId: string,
  language: string
): IThunkReturnObject<IChatGroupRequestAcceptedData> => {
  return {
    requestDataActionType:
      RequestDataConstants.CHAT_GROUP_INVITE_ACCEPTED_REQUEST,

    apiCall: async (): Promise<IChatGroupRequestAcceptedData> => {
      const { data }: AxiosResponse<IChatGroupAPIReturn> = await axios.post(
        '/api/chatgroup',
        newChatGroup
      )
      const newUserChatGroupsSubset: IUserChatGroupPostDTO[] = [
        loggedInUserId,
        userIdSentRequest
      ].map(id => ({ userId: id, chatGroupId: data.id }))
      const apiReturn = await Promise.all([
        axios.post('/api/userchatgroup', newUserChatGroupsSubset),
        respondToChatInviteBase(
          userIdSentRequest,
          loggedInUserId,
          chatGroupInviteRecipientId,
          ChatGroupInviteStatusOptions.ACCEPTED,
          language
        )
      ])
      return {
        newChatGroup: data,
        newUserChatGroups: apiReturn[0].data.filter(
          (ucg: UserChatGroup) => ucg.userId !== loggedInUserId
        ),
        language,
        newChatGroupId: data.id,
        ...apiReturn[1]
      }
    },

    dispatchActionOnSuccess: chatGroupRequestAccepted
  }
}

export const chatGroupRequestDeclinedThunk = (
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteRecipientId: string,
  language: string
): IThunkReturnObject<IChatGroupRequestBase> => {
  return {
    requestDataActionType:
      RequestDataConstants.CHAT_GROUP_INVITE_DECLINED_REQUEST,
    apiCall: async (): Promise<IChatGroupRequestBase> => {
      return respondToChatInviteBase(
        userIdSentRequest,
        loggedInUserId,
        chatGroupInviteRecipientId,
        ChatGroupInviteStatusOptions.DECLINED,
        language
      )
    },
    dispatchActionOnSuccess: chatGroupRequestDeclined
  }
}
