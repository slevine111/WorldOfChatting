import { INormalizedReducerShape } from '../store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../constants'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { normalizeData, createInitialState } from '../utilityfunctions'
import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  UserLoggedInAR,
} from '../../../app/actions'
import { addAndCheckUserIdToNoDirectChatSubGrouping } from '../../../app/reducers-update-helpers'

export type UserReducerState = INormalizedReducerShape<IReduxStoreUserFields>

export const userInitialState: UserReducerState = createInitialState(
  INITIAL_SUBGROUPING_KEYS.users
)

export const userReducer = (
  state: UserReducerState = userInitialState,
  action: UserLoggedInAR
): UserReducerState => {
  switch (action.type) {
    case APP_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.users, state, {
        subGroupingFunction: addAndCheckUserIdToNoDirectChatSubGrouping,
      })
    /*   case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, users } = action
      return normalizeData(users, state, {
        subGroupingKey: language,
      })*/
    default:
      return state
  }
}
