import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { createInitialState, normalizeData } from '../utilityfunctions'
import { INormalizedReducerShape } from '../reducer.base'
import { Message } from '../../../entities'
import { addIdToChatGroupSubGrouping } from './helperfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export type IMessageReducerState = INormalizedReducerShape<Message>

export default (
  state: IMessageReducerState = createInitialState(),
  action: SharedActionsTypes
): IMessageReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.messages, state, {
        subGroupingFunction: addIdToChatGroupSubGrouping
      })
    default:
      return state
  }
}
