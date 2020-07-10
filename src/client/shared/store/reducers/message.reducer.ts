import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  UserLoggedInAR,
} from '../../../app/actions'
import {
  createInitialState,
  normalizeData,
  makeFunctionToAddIdToForeignKeySubGrouping,
} from '../utilityfunctions'
import { CHAT_GROUP_KEY_PREFIX } from '../constants'
import { INormalizedReducerShape } from '../store.types'
import { Message } from '../../../../entities'

export type MessageReducerState = INormalizedReducerShape<Message>

export const messageInitialState: MessageReducerState = createInitialState()

type ActionReturns = UserLoggedInAR

export const messageReducer = (
  state: MessageReducerState = messageInitialState,
  action: ActionReturns
): MessageReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS:
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
