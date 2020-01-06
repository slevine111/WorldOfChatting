import { LOGOUT_USER_PROCESS, USER_LOGGED_IN } from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserChatGroup } from '../../../entities'

export interface IUserChatGroupReducer {
  data: UserChatGroup[]
  isLoading: boolean
}

const initialState: IUserChatGroupReducer = { data: [], isLoading: false }

export default (
  state: IUserChatGroupReducer = { ...initialState },
  action: SharedActionsTypes
): IUserChatGroupReducer => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case USER_LOGGED_IN:
      return { ...state, data: action.userChatGroups }
    default:
      return state
  }
}
