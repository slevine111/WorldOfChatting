import { RequestDataSuccessConstants } from '../APIRequestsHandling/types'
import { INormalizedReducerShape } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserChatGroup } from '../../../entities'
import { createInitialState } from '../utilityfunctions'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS
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
    default:
      return state
  }
}
