import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { INormalizedReducerShape } from '../reducer.base'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { normalizeData, createInitialState } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type INotificationReducerState = INormalizedReducerShape<
  INotificationReducerFields
>

export default (
  state: INotificationReducerState = createInitialState(),
  action: SharedActionsTypes
): INotificationReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.notifications)
    default:
      return state
  }
}
