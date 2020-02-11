import {
  RequestDataConstants,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { INormalizedReducerShape } from '../reducer.base'
import { normalizeData } from '../utilityfunctions'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants

//export type IUserNormalizedShape = INormalizedReducerShape<
//  IReduxStoreUserFields
//>

export type IUserReducerState = INormalizedReducerShape<IReduxStoreUserFields>

const initialState: IUserReducerState = {
  byId: {},
  allIds: [],
  subGroupings: {}
}

export default (
  state: IUserReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return action.users
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, users } = action
      return normalizeData(users, {
        subGroupingKey: language,
        currentNormalizedData: state
      })
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
    case REFRESHING_ACCESS_TOKEN_REQUEST:
      return { ...initialState }
    default:
      return state
  }
}
