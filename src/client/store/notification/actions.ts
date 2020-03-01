import axios, { AxiosResponse } from 'axios'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import { CHAT_GROUP_SOCKET_EVENT_RECEIVED } from './types'
import {
  RequestDataConstants,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { INotificationPostDTO } from '../../../server/notifications/notifications.dto'
import { NtRecipientStatusOptions } from '../../../entities/NotificationRecipient'
const {
  INVITING_TO_CHAT_REQUEST,
  CHAT_GROUP_INVITE_DECLINED_REQUEST
} = RequestDataConstants

const chatGroupInvitationSent = (
  notificationReducerItem: INotificationReducerFields
) => ({
  type: <const>RequestDataSuccessConstants.INVITING_TO_CHAT_REQUEST_SUCCESS,
  notificationReducerItem
})
type ChatGroupInvitationSentActionReturn = ReturnType<
  typeof chatGroupInvitationSent
>

export const chatGroupSocketEventReceived = (
  notification: INotificationReducerFields
) => ({
  type: CHAT_GROUP_SOCKET_EVENT_RECEIVED,
  notification
})
type ChatGroupSocketEventReceivedActionReturn = ReturnType<
  typeof chatGroupSocketEventReceived
>

export const chatGroupRequestDeclined = (
  updatedNotification: INotificationReducerFields
) => ({
  type: <const>(
    RequestDataSuccessConstants.CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS
  ),
  updatedNotification
})
type ChatGroupRequestDeclinedActionReturn = ReturnType<
  typeof chatGroupRequestDeclined
>

export type NotificationActionReturns =
  | ChatGroupInvitationSentActionReturn
  | ChatGroupSocketEventReceivedActionReturn
  | ChatGroupRequestDeclinedActionReturn

export const chatGroupInviteThunk = (
  newNotificationPost: INotificationPostDTO,
  targetUserId: string
): IThunkReturnObject<INotificationReducerFields> => {
  return {
    requestDataActionType: INVITING_TO_CHAT_REQUEST,
    apiCall: (): Promise<AxiosResponse<INotificationReducerFields>> => {
      return axios
        .post('/api/notification', newNotificationPost)
        .then(({ data }) => {
          return axios.post('/api/notification/notificationRecipient/single', {
            newNotification: data,
            targetUserId
          })
        })
    },
    dispatchActionOnSuccess: chatGroupInvitationSent
  }
}

export const chatGroupRequestDeclinedThunk = (
  ntRecipientId: string
): IThunkReturnObject<INotificationReducerFields> => {
  return {
    requestDataActionType: CHAT_GROUP_INVITE_DECLINED_REQUEST,
    apiCall: (): Promise<AxiosResponse<INotificationReducerFields>> => {
      return axios.put(
        `api/notification/notificationRecipient/${ntRecipientId}`,
        {
          status: NtRecipientStatusOptions.DECLINED
        }
      )
    },
    dispatchActionOnSuccess: chatGroupRequestDeclined
  }
}
