import {
  SET_MY_USER_CHAT_GROUPS,
  SET_CURRENT_LANGUAGE_USER_CHAT_GROUPS,
  SET_MY_AND_CURRENT_LANGUAGE_USER_CHAT_GROUPS
} from './types'
import { UserChatGroupActionTypes } from './actions'
import { UserChatGroup } from '../../../entities'

export interface IUserChatGroupReducerState {
  myUserCGs: UserChatGroup[]
  currentLanguageUserCGs: UserChatGroup[]
}

export default (
  state: IUserChatGroupReducerState = {
    myUserCGs: [],
    currentLanguageUserCGs: []
  },
  action: UserChatGroupActionTypes
): IUserChatGroupReducerState => {
  switch (action.type) {
    case SET_MY_AND_CURRENT_LANGUAGE_USER_CHAT_GROUPS:
      return {
        myUserCGs: action.myUserChatGroups,
        currentLanguageUserCGs: action.cLUserChatGroups
      }
    case SET_MY_USER_CHAT_GROUPS:
      return { ...state, myUserCGs: action.userChatGroups }
    case SET_CURRENT_LANGUAGE_USER_CHAT_GROUPS:
      return { ...state, currentLanguageUserCGs: action.userChatGroups }
    default:
      return state
  }
}
