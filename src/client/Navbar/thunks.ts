import axios, { AxiosResponse } from 'axios'
import { REQUEST_ACTION_TYPES, actionCreators } from './actions'
import {
  IChatGroupRequestAcceptedData,
  IChatGroupRequestDeclinedData,
} from './types'
import {
  IThunkReturnObject,
  NotificationReducerState,
} from '../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../shared/store/constants'
import { IChatGroupAPIReturn } from '../../types-for-both-server-and-client'
import { UserChatGroup, Notification } from '../../entities'
import { IChatGroupPostDTO } from '../../server/chatgroups/chatgroups.dto'
import { IUserChatGroupPostDTO } from '../../server/userchatgroups/userchatgroups.dto'
import { NotificationTypes } from '../../entities/Notification'
import { ChatGroupInviteStatusOptions } from '../../entities/ChatGroupInvite'
import { OnlineStatuses } from '../../entities/User'
const {
  notifications: { NOT_SEEN },
} = INITIAL_SUBGROUPING_KEYS

const notificationAPICall = async (
  notificationType: NotificationTypes,
  targetUserId: string,
  loggedInUserId: string
): Promise<AxiosResponse> => {
  const currentNotifications: Notification[] = await axios.get(
    `/api/notification/currentDate/${notificationType}/${targetUserId}`
  )
  if (currentNotifications.length >= 2) {
    throw Error('bad')
  }
  if (currentNotifications.length === 1) {
    const { id, sendersUserIds } = currentNotifications[0]
    return axios.put(`/api/notification/single/${id}`, {
      currentNotification: currentNotifications[0],
      updatedNotification: {
        sendersUserIds: [...sendersUserIds, loggedInUserId],
        clickedOn: false,
        seen: false,
      },
    })
  } else {
    return axios.post('/api/notification', {
      notificationType,
      senderId: loggedInUserId,
      targetUserId,
    })
  }
}

const respondToChatInviteBase = async (
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteId: string,
  status: ChatGroupInviteStatusOptions,
  notificationType: NotificationTypes
): Promise<IChatGroupRequestDeclinedData> => {
  const apiReturn = await Promise.all([
    notificationAPICall(notificationType, userIdSentRequest, loggedInUserId),
    axios.put(`/api/chatgroupinvite/${chatGroupInviteId}`, {
      status,
    }),
  ])
  return {
    newNotification: apiReturn[0].data,
    chatGroupInviteId,
  }
}

export const chatGroupRequestAcceptedThunk = (
  newChatGroup: IChatGroupPostDTO,
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteId: string
): IThunkReturnObject<IChatGroupRequestAcceptedData> => {
  return {
    requestDataActionType:
      REQUEST_ACTION_TYPES.CHAT_GROUP_INVITE_ACCEPTED_REQUEST,

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
          chatGroupInviteId,
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

    dispatchActionOnSuccess: actionCreators.chatGroupRequestAccepted,
  }
}

export const chatGroupRequestDeclinedThunk = (
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteRecipientId: string
): IThunkReturnObject<IChatGroupRequestDeclinedData> => {
  return {
    requestDataActionType:
      REQUEST_ACTION_TYPES.CHAT_GROUP_INVITE_DECLINED_REQUEST,
    apiCall: async (): Promise<IChatGroupRequestDeclinedData> => {
      return respondToChatInviteBase(
        userIdSentRequest,
        loggedInUserId,
        chatGroupInviteRecipientId,
        ChatGroupInviteStatusOptions.DECLINED,
        NotificationTypes.CHAT_GROUP_INVITE_DECLINED
      )
    },
    dispatchActionOnSuccess: actionCreators.chatGroupRequestDeclined,
  }
}

export const notificationIconClickedOnThunk = (
  ntState: NotificationReducerState
): IThunkReturnObject<Notification[]> => {
  return {
    requestDataActionType:
      REQUEST_ACTION_TYPES.CLICKED_ON_NOTIFICATIONS_ICON_REQUEST,
    apiCall: () => {
      const { byId, subGroupings } = ntState
      return axios.put(
        '/api/notification/multiple',
        subGroupings[NOT_SEEN].map((id) => ({
          currentNotification: byId[id],
          updatedNotification: { seen: true },
        }))
      )
    },
    dispatchActionOnSuccess: actionCreators.notificationIconClickedOn,
  }
}

export const singleNotificationClickedOnThunk = (
  currentNotification: Notification
): IThunkReturnObject<Notification> => {
  return {
    requestDataActionType: REQUEST_ACTION_TYPES.CLICKED_ON_SINGLE_NT_REQUEST,
    apiCall: () => {
      const { id } = currentNotification
      return axios.put(`/api/notification/single/${id}`, {
        currentNotification,
        updatedNotification: { clickedOn: true },
      })
    },
    dispatchActionOnSuccess: actionCreators.singleNotificationClickedOn,
  }
}

export const logoutUserProcessThunk = (
  userId: string
): IThunkReturnObject<[]> => {
  return {
    requestDataActionType: REQUEST_ACTION_TYPES.USER_LOGGING_OUT_REQUEST,
    apiCall: async (): Promise<AxiosResponse> => {
      await axios.put(`/api/user/${userId}`, {
        onlineStatus: OnlineStatuses.OFFLINE,
      })
      return axios.delete('/api/auth')
    },
    dispatchActionOnSuccess: actionCreators.userLoggedOut,
    bypassRefreshTokenMiddleware: true,
  }
}
