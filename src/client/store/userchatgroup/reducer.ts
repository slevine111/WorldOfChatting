import {
  LOGOUT_USER_PROCESS,
  USER_LOGGED_IN,
  RequestDataConstants
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserChatGroup } from '../../../entities'
const { REQUEST_DATA_USER_LOGGED_IN } = RequestDataConstants

export interface IUserChatGroupReducerState {
  data: UserChatGroup[]
  isLoading: boolean
}

const initialState: IUserChatGroupReducerState = { data: [], isLoading: false }

export default (
  state: IUserChatGroupReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserChatGroupReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case USER_LOGGED_IN:
      return { data: action.userChatGroups, isLoading: action.isLoading }
    case REQUEST_DATA_USER_LOGGED_IN:
      return { data: [], isLoading: true }
    default:
      return state
  }
}
