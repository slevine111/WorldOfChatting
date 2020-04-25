import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { createInitialState, normalizeData } from '../utilityfunctions'
import { INormalizedReducerShape } from '../reducer.base'
import { Message } from '../../../entities'
import {
  CHAT_GROUP_KEY_PREFIX,
  makeFunctionToAddIdToForeignKeySubGrouping,
} from '../common'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
} = RequestDataSuccessConstants

export type IMessageReducerState = INormalizedReducerShape<Message>

export default (
  state: IMessageReducerState = createInitialState(),
  action: SharedActionsTypes
): IMessageReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.messages, state, {
        subGroupingFunction: makeFunctionToAddIdToForeignKeySubGrouping(
          CHAT_GROUP_KEY_PREFIX,
          'chatGroupId'
        ),
      })
    default:
      return state
  }
}
