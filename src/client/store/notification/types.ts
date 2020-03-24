import { INormalizedReducerShape } from '../reducer.base'
import { Notification } from '../../../entities'

export const NOTIFICATION_RECEIVED = <const>'NOTIFICATION_RECEIVED'

export type INotificationReducerState = INormalizedReducerShape<Notification>
