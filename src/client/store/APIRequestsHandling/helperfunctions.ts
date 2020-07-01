import { IChatGroupRequestBase } from './types'
import { Notification } from '../../../entities'
import { ChatGroupInviteStatusOptions } from '../../../entities/ChatGroupInvite'
import { NotificationTypes } from '../../../entities/Notification'
import axios, { AxiosResponse } from 'axios'

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

export const respondToChatInviteBase = async (
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteId: string,
  status: ChatGroupInviteStatusOptions,
  notificationType: NotificationTypes
): Promise<IChatGroupRequestBase> => {
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
