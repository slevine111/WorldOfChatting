import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { INormalizedReducerShape } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserChatGroup } from '../../../entities'
import { createInitialState, normalizeData } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS
} = RequestDataSuccessConstants

export const CHAT_GROUP_KEY_PREFIX = <const>'chatGroup'

export type IUserChatGroupReducerState = INormalizedReducerShape<UserChatGroup>

export default (
  state: IUserChatGroupReducerState = createInitialState(),
  action: SharedActionsTypes
): IUserChatGroupReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return action.userChatGroups
    case CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      return normalizeData(action.newUserChatGroups, state, {
        subGroupingKey: `${CHAT_GROUP_KEY_PREFIX}${action.newChatGroupId}`
      })
    default:
      return state
  }
}
