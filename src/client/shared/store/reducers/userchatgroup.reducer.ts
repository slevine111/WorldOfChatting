import { INormalizedReducerShape } from '../store.types'
import { UserChatGroup } from '../../../../entities'
import {
  createInitialState,
  normalizeData,
  makeFunctionToAddIdToForeignKeySubGrouping,
} from '../utilityfunctions'
import { CHAT_GROUP_KEY_PREFIX } from '../constants'
import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  UserLoggedInAR,
} from '../../../app/actions'
import {
  REQUEST_SUCCESS_ACTION_TYPES as NAVBAR_ACTION_TYPES,
  ChatGroupRequestAcceptedAR,
} from '../../../Navbar/actions'
import { userInitialState } from './user.reducer'

export type UserChatGroupReducerState = INormalizedReducerShape<UserChatGroup>

export const userChatGroupInitialState: UserChatGroupReducerState = createInitialState()

type ActionReturns = UserLoggedInAR | ChatGroupRequestAcceptedAR

export const userChatGroupReducer = (
  state: UserChatGroupReducerState = userChatGroupInitialState,
  action: ActionReturns
): UserChatGroupReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.userChatGroups, state, {
        subGroupingFunction: makeFunctionToAddIdToForeignKeySubGrouping(
          CHAT_GROUP_KEY_PREFIX,
          'chatGroupId'
        ),
      })
    case NAVBAR_ACTION_TYPES.CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      return normalizeData(action.newUserChatGroups, state, {
        subGroupingKey: `${CHAT_GROUP_KEY_PREFIX}${action.newChatGroupId}`,
      })
    default:
      return state
  }
}
