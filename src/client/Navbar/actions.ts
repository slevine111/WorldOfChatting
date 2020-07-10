import { ActionCreatorsMapObject, AnyAction } from 'redux'
import {
  IChatGroupRequestAcceptedData,
  IChatGroupRequestDeclinedData,
} from './types'
import { Notification } from '../../entities'

const CHAT_GROUP_INVITE_ACCEPTED_REQUEST = <const>(
  'CHAT_GROUP_INVITE_ACCEPTED_REQUEST'
)
const CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS = <const>(
  'CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS'
)
const chatGroupRequestAccepted = (data: IChatGroupRequestAcceptedData) => ({
  type: CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS,
  ...data,
})

const CHAT_GROUP_INVITE_DECLINED_REQUEST = <const>(
  'CHAT_GROUP_INVITE_DECLINED_REQUEST'
)
const CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS = <const>(
  'CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS'
)
const chatGroupRequestDeclined = (data: IChatGroupRequestDeclinedData) => ({
  type: CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS,
  ...data,
})

const CLICKED_ON_NOTIFICATIONS_ICON_REQUEST = <const>(
  'CLICKED_ON_NOTIFICATIONS_ICON_REQUEST'
)
const CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS = <const>(
  'CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS'
)
const notificationIconClickedOn = (updatedNotifications: Notification[]) => ({
  type: CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS,
  updatedNotifications,
})

const CLICKED_ON_SINGLE_NT_REQUEST = <const>'CLICKED_ON_SINGLE_NT_REQUEST'
const CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS = <const>(
  'CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS'
)
const singleNotificationClickedOn = (updatedNotification: Notification) => ({
  type: CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS,
  updatedNotification,
})

const USER_LOGGING_OUT_REQUEST = <const>'USER_LOGGING_OUT_REQUEST'
const USER_LOGGING_OUT_REQUEST_SUCCESS = <const>(
  'USER_LOGGING_OUT_REQUEST_SUCCESS'
)
const userLoggedOut = () => ({
  type: USER_LOGGING_OUT_REQUEST_SUCCESS,
})

export const REQUEST_ACTION_TYPES = <const>{
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST,
  CHAT_GROUP_INVITE_DECLINED_REQUEST,
  CLICKED_ON_NOTIFICATIONS_ICON_REQUEST,
  CLICKED_ON_SINGLE_NT_REQUEST,
  USER_LOGGING_OUT_REQUEST,
}

export const REQUEST_SUCCESS_ACTION_TYPES = <const>{
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS,
  CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS,
  CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS,
}

export const actionCreators: ActionCreatorsMapObject<AnyAction> = <const>{
  chatGroupRequestAccepted,
  chatGroupRequestDeclined,
  notificationIconClickedOn,
  singleNotificationClickedOn,
  userLoggedOut,
}

export type ChatGroupRequestAcceptedAR = ReturnType<
  typeof chatGroupRequestAccepted
>
export type ChatGroupRequestDeclinedAR = ReturnType<
  typeof chatGroupRequestDeclined
>
export type NotificationIconClickedOnAR = ReturnType<
  typeof notificationIconClickedOn
>
export type SingleNotificationClickedOnAR = ReturnType<
  typeof singleNotificationClickedOn
>
export type UserLoggedOutAR = ReturnType<typeof userLoggedOut>
