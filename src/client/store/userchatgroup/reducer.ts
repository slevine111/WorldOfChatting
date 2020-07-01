import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { INormalizedReducerShape } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserChatGroup } from '../../../entities'
import { createInitialState, normalizeData } from '../utilityfunctions'
import {
  CHAT_GROUP_KEY_PREFIX,
  makeFunctionToAddIdToForeignKeySubGrouping,
} from '../common'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS,
} = RequestDataSuccessConstants

export const UCG_LOGGED_IN_USER_KEY = <const>'loggedInUser'

export type IUserChatGroupReducerState = INormalizedReducerShape<UserChatGroup>

export default (
  state: IUserChatGroupReducerState = createInitialState(
    UCG_LOGGED_IN_USER_KEY
  ),
  action: SharedActionsTypes
): IUserChatGroupReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.userChatGroups, state, {
        subGroupingFunction: makeFunctionToAddIdToForeignKeySubGrouping(
          CHAT_GROUP_KEY_PREFIX,
          'chatGroupId'
        ),
      })
    case CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      return normalizeData(action.newUserChatGroups, state, {
        subGroupingKey: `${CHAT_GROUP_KEY_PREFIX}${action.newChatGroupId}`,
      })
    default:
      return state
  }
}
