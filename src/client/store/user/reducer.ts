import {
  RequestDataConstants,
  RequestDataSuccessConstants,
  RequestDataFailureConstants
} from '../APIRequestsHandling/types'
import { IBaseReducerTwo, INormalizedReducerShape } from '../reducer.base'
import { normalizeData } from '../utilityfunctions'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
const {
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST,
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST
} = RequestDataConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS
} = RequestDataSuccessConstants
const {
  HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE,
  WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE,
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE
} = RequestDataFailureConstants

export type IUserNormalizedShape = INormalizedReducerShape<
  IReduxStoreUserFields
>

export type IUserReducerState = IBaseReducerTwo<IUserNormalizedShape>

const initialState: IUserReducerState = {
  data: { byId: {}, allIds: [], subGroupings: {} },
  isLoading: false,
  error: null
}

export default (
  state: IUserReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserReducerState => {
  switch (action.type) {
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST:
      return { ...initialState, isLoading: action.isLoading }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_SUCCESS:
      return {
        data: action.users,
        isLoading: action.isLoading,
        error: action.error
      }
    case HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST_FAILURE:
      return { ...initialState, error: action.error }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST:
      return { ...state, isLoading: action.isLoading }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_SUCCESS:
      const { language, users, isLoading, error } = action
      return {
        data: normalizeData(users, {
          subGroupingKey: language,
          currentNormalizedData: state.data
        }),
        isLoading,
        error
      }
    case WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST_FAILURE:
      return { ...state, error: action.error }
    case USER_LOGGING_OUT_REQUEST_SUCCESS:
    case REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE:
      return { ...initialState }
    default:
      return state
  }
}
