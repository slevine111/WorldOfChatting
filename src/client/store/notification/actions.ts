import {
  NOT_SEEN,
  NOTIFICATION_RECEIVED,
  INotificationReducerState
} from './types'
import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  IThunkReturnObject
} from '../APIRequestsHandling/types'
import { Notification } from '../../../entities'
import axios from 'axios'

export const notificationReceived = (newNotification: Notification) => ({
  type: NOTIFICATION_RECEIVED,
  newNotification
})

const notificationIconClickedOn = (updatedNotifications: Notification[]) => ({
  type: <const>(
    RequestDataSuccessConstants.CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS
  ),
  updatedNotifications
})

const singleNotificationClickedOn = (updatedNotification: Notification) => ({
  type: <const>RequestDataSuccessConstants.CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS,
  updatedNotification
})

export type NotificationActionReturns =
  | ReturnType<typeof notificationReceived>
  | ReturnType<typeof notificationIconClickedOn>
  | ReturnType<typeof singleNotificationClickedOn>

export const notificationIconClickedOnThunk = (
  ntState: INotificationReducerState
): IThunkReturnObject<Notification[]> => {
  return {
    requestDataActionType:
      RequestDataConstants.CLICKED_ON_NOTIFICATIONS_ICON_REQUEST,
    apiCall: () => {
      const { byId, subGroupings } = ntState
      return axios.put(
        '/api/notification/multiple',
        subGroupings[NOT_SEEN].map(id => ({
          currentNotification: byId[id],
          updatedNotification: { seen: true }
        }))
      )
    },
    dispatchActionOnSuccess: notificationIconClickedOn
  }
}

export const singleNotificationClickedOnThunk = (
  currentNotification: Notification
): IThunkReturnObject<Notification> => {
  return {
    requestDataActionType: RequestDataConstants.CLICKED_ON_SINGLE_NT_REQUEST,
    apiCall: () => {
      const { id } = currentNotification
      return axios.put(`/api/notification/single/${id}`, {
        currentNotification,
        updatedNotification: { clickedOn: true }
      })
    },
    dispatchActionOnSuccess: singleNotificationClickedOn
  }
}
