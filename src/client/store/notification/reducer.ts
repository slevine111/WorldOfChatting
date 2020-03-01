import { CHAT_GROUP_SOCKET_EVENT_RECEIVED } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { INormalizedReducerShape } from '../reducer.base'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { createInitialState, normalizeData } from '../utilityfunctions'
import { NotificationActionReturns } from './actions'
import { NOTIFICATIONS_DISPLAY } from './helperfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  INVITING_TO_CHAT_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type INotificationReducerState = INormalizedReducerShape<
  INotificationReducerFields
>

export default (
  state: INotificationReducerState = createInitialState(NOTIFICATIONS_DISPLAY),
  action: SharedActionsTypes | NotificationActionReturns
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return action.notifications
    case INVITING_TO_CHAT_REQUEST_SUCCESS:
      return normalizeData(action.notificationReducerItem, state)
    case CHAT_GROUP_SOCKET_EVENT_RECEIVED:
      return normalizeData(action.notification, state, {
        subGroupingKey: NOTIFICATIONS_DISPLAY
      })
    case CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
    case CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS:
      return normalizeData(action.updatedNotification, state)
    default:
      return state
  }
}
