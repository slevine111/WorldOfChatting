import axios, { AxiosResponse } from 'axios'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import {
  RequestDataConstants,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { INotificationPostDTO } from '../../../server/notifications/notifications.dto'
const { INVITING_TO_CHAT_REQUEST } = RequestDataConstants

const chatGroupInvitationSent = (
  notificationReducerItem: INotificationReducerFields
) => ({
  type: <const>RequestDataSuccessConstants.INVITING_TO_CHAT_REQUEST_SUCCESS,
  notificationReducerItem
})
type ChatGroupInvitationSentActionReturn = ReturnType<
  typeof chatGroupInvitationSent
>

export const chatGroupInvitationReceived = (
  notification: INotificationReducerFields
) => ({
  type: <const>RequestDataSuccessConstants.CHAT_REQUEST_INVITATION_RECEIVED,
  notification
})
type ChatGroupInvitationReceivedActionReturn = ReturnType<
  typeof chatGroupInvitationReceived
>

export type NotificationActionReturns =
  | ChatGroupInvitationSentActionReturn
  | ChatGroupInvitationReceivedActionReturn

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
