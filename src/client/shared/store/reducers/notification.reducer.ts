import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  UserLoggedInAR,
} from '../../../app/actions'
import { addAndCheckNtIdToNotSeenSubGrouping } from '../../../app/reducers-update-helpers'
import {
  ACTION_TYPES as SOCKET_DISPATCH_ACTION_TYPES,
  NotificationReceivedAR,
} from '../middleware/socket/actions'
import { normalizeAndMakeNotificationFirst } from '../middleware/socket/reducers-update-helpers'
import {
  REQUEST_SUCCESS_ACTION_TYPES as NAVBAR_ACTION_TYPES,
  NotificationIconClickedOnAR,
  SingleNotificationClickedOnAR,
} from '../../../Navbar/actions'
import { normalizeAndEmptyNotSeenNtSubgrouping } from '../../../Navbar/reducers-update-helpers'
import { INormalizedReducerShape } from '../store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../constants'
import { Notification } from '../../../../entities'
import { createInitialState, normalizeData } from '../utilityfunctions'

export type NotificationReducerState = INormalizedReducerShape<Notification>

export const notificationInitialState: NotificationReducerState = createInitialState(
  INITIAL_SUBGROUPING_KEYS.notifications
)

type ActionReturns =
  | UserLoggedInAR
  | NotificationReceivedAR
  | NotificationIconClickedOnAR
  | SingleNotificationClickedOnAR

export const notificationReducer = (
  state: NotificationReducerState = notificationInitialState,
  action: ActionReturns
): NotificationReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.notifications, state, {
        subGroupingFunction: addAndCheckNtIdToNotSeenSubGrouping,
      })
    case SOCKET_DISPATCH_ACTION_TYPES.NOTIFICATION_RECEIVED:
      return normalizeAndMakeNotificationFirst(action.newNotification, state)
    case NAVBAR_ACTION_TYPES.CLICKED_ON_NOTIFICATIONS_ICON_REQUEST_SUCCESS:
      return normalizeAndEmptyNotSeenNtSubgrouping(
        action.updatedNotifications,
        state
      )
    case NAVBAR_ACTION_TYPES.CLICKED_ON_SINGLE_NT_REQUEST_SUCCESS:
      return normalizeData(action.updatedNotification, state)
    default:
      return state
  }
}
