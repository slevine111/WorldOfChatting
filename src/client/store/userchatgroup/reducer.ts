import {
  RequestDataSuccessConstants,
  RequestDataConstants
} from '../APIRequestsHandling/types'
import { INormalizedReducerShape } from '../reducer.base'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { UserChatGroup } from '../../../entities'
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants

export const CHAT_GROUP_KEY_PREFIX = <const>'chatGroup'

//export type IUserChatGroupNormalizedShape = INormalizedReducerShape<
//  UserChatGroup
//>

export type IUserChatGroupReducerState = INormalizedReducerShape<UserChatGroup>

const initialState: IUserChatGroupReducerState = {
  byId: {},
  allIds: [],
  subGroupings: {}
}

export default (
  state: IUserChatGroupReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserChatGroupReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return action.userChatGroups
    case REFRESHING_ACCESS_TOKEN_REQUEST:
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
      return { ...initialState }
    default:
      return state
  }
}
