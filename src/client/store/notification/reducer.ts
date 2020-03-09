import { NOTIFICATION_RECEIVED } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { INormalizedReducerShape } from '../reducer.base'
import { createInitialState, normalizeData } from '../utilityfunctions'
import { NotificationActionReturns } from './actions'
import { Notification } from '../../../entities'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type INotificationReducerState = INormalizedReducerShape<Notification>

export default (
  state: INotificationReducerState = createInitialState(),
  action: SharedActionsTypes | NotificationActionReturns
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.notifications, state)
    case NOTIFICATION_RECEIVED:
      return normalizeData(action.newNotification, state)
    default:
      return state
  }
}
