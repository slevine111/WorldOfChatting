import { CHAT_REQUEST_INVITATION_RECEIVED } from './types'
import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { INormalizedReducerShape } from '../reducer.base'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { createInitialState, normalizeData } from '../utilityfunctions'
import { NotificationActionReturns } from './actions'
import { USER_SENDER, USER_RECEIVER } from './helperfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  INVITING_TO_CHAT_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type INotificationReducerState = INormalizedReducerShape<
  INotificationReducerFields
>

export default (
  state: INotificationReducerState = createInitialState([
    USER_SENDER,
    USER_RECEIVER
  ]),
  action: SharedActionsTypes | NotificationActionReturns
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return action.notifications
    case INVITING_TO_CHAT_REQUEST_SUCCESS:
      return normalizeData(action.notificationReducerItem, state, {
        subGroupingKey: USER_SENDER
      })
    case CHAT_REQUEST_INVITATION_RECEIVED:
      return normalizeData(action.notification, state, {
        subGroupingKey: USER_RECEIVER
      })
    default:
      return state
  }
}
