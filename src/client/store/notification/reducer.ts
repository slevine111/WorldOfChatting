import { NOTIFICATION_RECEIVED, INotificationReducerState } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { createInitialState, normalizeData } from '../utilityfunctions'
import { NotificationActionReturns } from './actions'
import { normalizeAndMakeNotificationFirst } from './helperfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export default (
  state: INotificationReducerState = createInitialState(),
  action: SharedActionsTypes | NotificationActionReturns
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.notifications, state)
    case NOTIFICATION_RECEIVED:
      return normalizeAndMakeNotificationFirst(action.newNotification, state)
    default:
      return state
  }
}
