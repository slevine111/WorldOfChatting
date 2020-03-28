import {
  NOT_SEEN,
  NOTIFICATION_RECEIVED,
  INotificationReducerState
} from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { createInitialState, normalizeData } from '../utilityfunctions'
import { NotificationActionReturns } from './actions'
import {
  addNotSeenNt,
  normalizeAndMakeNotificationFirst,
  normalizeAndEmptyNotSeenSubgrouping
} from './helperfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS,
  CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export default (
  state: INotificationReducerState = createInitialState(NOT_SEEN),
  action: SharedActionsTypes | NotificationActionReturns
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.notifications, state, {
        subGroupingFunction: addNotSeenNt
      })
    case NOTIFICATION_RECEIVED:
      return normalizeAndMakeNotificationFirst(action.newNotification, state)
    case CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS:
      return normalizeAndEmptyNotSeenSubgrouping(
        action.updatedNotifications,
        state
      )
    case CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS:
      return normalizeData(action.updatedNotification, state)
    default:
      return state
  }
}
