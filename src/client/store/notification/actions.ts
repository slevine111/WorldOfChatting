import { NOTIFICATION_RECEIVED } from './types'
import { Notification } from '../../../entities'

export const notificationReceived = (newNotification: Notification) => ({
  type: NOTIFICATION_RECEIVED,
  newNotification
})

export type NotificationActionReturns = ReturnType<typeof notificationReceived>
