import { INITIAL_SUBGROUPING_KEYS } from '../constants'
import { UserLanguage } from '../../../../entities'
import { INormalizedReducerShape } from '../store.types'
import {
  normalizeData,
  createInitialState,
  makeFunctionToAddIdToForeignKeySubGrouping,
} from '../utilityfunctions'
import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  UserLoggedInAR,
} from '../../../app/actions'
const {
  userLanguages: { LOGGED_IN_USER_SUBGROUPING_KEY },
} = INITIAL_SUBGROUPING_KEYS

export type UserLanguageReducerState = INormalizedReducerShape<UserLanguage>

export const userLanguageInitialState: UserLanguageReducerState = createInitialState(
  INITIAL_SUBGROUPING_KEYS.userLanguages
)

type ActionReturns = UserLoggedInAR

export const userLanguageReducer = (
  state: UserLanguageReducerState = userLanguageInitialState,
  action: ActionReturns
): UserLanguageReducerState => {
  switch (action.type) {
    //user logging in
    case APP_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST_SUCCESS:
      return normalizeData(action.userLanguages, state, {
        subGroupingFunction: makeFunctionToAddIdToForeignKeySubGrouping(
          LOGGED_IN_USER_SUBGROUPING_KEY,
          'userId'
        ),
      })
    /* case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, userLanguages } = action
      return normalizeData(userLanguages, state, {
        subGroupingKey: language,
      })*/
    default:
      return state
  }
}
