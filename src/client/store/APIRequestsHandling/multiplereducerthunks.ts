import {
  userLoggedOut,
  userLoggedIn,
  wentToLanguagePageView,
  chatGroupRequestAccepted,
  chatGroupRequestDeclined,
} from './multiplereduceractions'
import {
  LanguagePageDataRetrivalArrayDataTypes,
  UserLoggedInDataTransformationInput,
  IChatGroupRequestAcceptedData,
  IChatGroupRequestBase,
  RequestDataConstants,
  IThunkReturnObject,
} from './types'
import { respondToChatInviteBase } from './helperfunctions'
import { IChatGroupPostDTO } from '../../../server/chatgroups/chatgroups.dto'
import { IUserChatGroupPostDTO } from '../../../server/userchatgroups/userchatgroups.dto'
import {
  IChatGroupAPIReturn,
  IReduxStoreUserFields,
} from '../../../types-for-both-server-and-client'
import { User, UserLanguage, UserChatGroup } from '../../../entities'
import { ChatGroupInviteStatusOptions } from '../../../entities/ChatGroupInviteRecipient'
import { NotificationTypes } from '../../../entities/Notification'
import { OnlineStatuses } from '../../../entities/User'
import axios, { AxiosResponse } from 'axios'

export const logoutUserProcessThunk = (
  userId: string
): IThunkReturnObject<[]> => {
  return {
    requestDataActionType: RequestDataConstants.USER_LOGGING_OUT_REQUEST,
    apiCall: async (): Promise<AxiosResponse> => {
      await axios.put(`/api/user/${userId}`, {
        onlineStatus: OnlineStatuses.OFFLINE,
      })
      return axios.delete('/api/auth')
    },
    dispatchActionOnSuccess: userLoggedOut,
    dispatchProps: {},
    bypassRefreshTokenMiddleware: true,
  }
}

export const userLoggedInDataRetrivalThunk = (
  user: User
): IThunkReturnObject<UserLoggedInDataTransformationInput> => {
  return {
    requestDataActionType:
      RequestDataConstants.HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST,
    apiCall: (): Promise<AxiosResponse[]> => {
      return Promise.all([
        axios.get(`/api/chatgroup/${user.id}`),
        axios.get(`/api/userlanguage/${user.id}/linkedto`),
        axios.get(`/api/user/${user.id}/linkedto`),
        axios.get(`/api/userchatgroup/${user.id}/linkedto`),
        axios.get(`/api/chatgroupinvite/${user.id}`),
        axios.get(`/api/notification/${user.id}`),
        axios.get(`/api/message/user/${user.id}`),
      ])
    },
    dispatchActionOnSuccess: userLoggedIn,
    dispatchProps: {},
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
        axios.get(`/api/user/linked/language/${language}`),
      ])
    },
    dataTransformationCall: (
      apiResponseData: LangPageDataRetrivalTransformationInput
    ): LanguagePageDataRetrivalArrayDataTypes => {
      const [userLanguages, user] = apiResponseData
      return [userLanguages, user, language]
    },
    dispatchActionOnSuccess: wentToLanguagePageView,
    dispatchProps: {},
  }
}

export const chatGroupRequestAcceptedThunk = (
  newChatGroup: IChatGroupPostDTO,
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteRecipientId: string
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
        userIdSentRequest,
      ].map((id) => ({ userId: id, chatGroupId: data.id }))
      const apiReturn = await Promise.all([
        axios.post('/api/userchatgroup', newUserChatGroupsSubset),
        respondToChatInviteBase(
          userIdSentRequest,
          loggedInUserId,
          chatGroupInviteRecipientId,
          ChatGroupInviteStatusOptions.ACCEPTED,
          NotificationTypes.CHAT_GROUP_INVITE_ACCEPTED
        ),
      ])
      return {
        newChatGroup: data,
        newUserChatGroups: apiReturn[0].data.filter(
          (ucg: UserChatGroup) => ucg.userId !== loggedInUserId
        ),
        newChatGroupId: data.id,
        ...apiReturn[1],
      }
    },

    dispatchActionOnSuccess: chatGroupRequestAccepted,
  }
}

export const chatGroupRequestDeclinedThunk = (
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteRecipientId: string
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
        NotificationTypes.CHAT_GROUP_INVITE_DECLINED
      )
    },
    dispatchActionOnSuccess: chatGroupRequestDeclined,
  }
}
