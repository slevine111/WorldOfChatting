import { ChatGroupInvite, Notification } from '../../../../../entities'

const CHAT_GROUP_INVITE_RECEIVED = <const>'CHAT_GROUP_INVITE_RECEIVED'
const chatGroupInviteReceived = (
  chatGroupInviteReducerItem: ChatGroupInvite
) => ({
  type: CHAT_GROUP_INVITE_RECEIVED,
  chatGroupInviteReducerItem,
})
export type ChatGroupInviteReceivedAR = ReturnType<
  typeof chatGroupInviteReceived
>

const NOTIFICATION_RECEIVED = <const>'NOTIFICATION_RECEIVED'
const notificationReceived = (newNotification: Notification) => ({
  type: NOTIFICATION_RECEIVED,
  newNotification,
})
export type NotificationReceivedAR = ReturnType<typeof notificationReceived>

export const ACTION_TYPES = <const>{
  CHAT_GROUP_INVITE_RECEIVED,
  NOTIFICATION_RECEIVED,
}

export const actionCreators = <const>{
  chatGroupInviteReceived,
  notificationReceived,
}
