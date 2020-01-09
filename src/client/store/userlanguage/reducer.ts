import {
  LOGOUT_USER_PROCESS,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  RequestDataConstants
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserLanguage } from '../../../entities'
const { REQUEST_DATA_API } = RequestDataConstants

export interface IUserLangugeReducerState {
  data: UserLanguage[]
  isLoading: boolean
}

const initialState: IUserLangugeReducerState = { data: [], isLoading: false }

export default (
  state: IUserLangugeReducerState = { ...initialState },
  action: SharedActionsTypes
): IUserLangugeReducerState => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      return { data: action.userLanguages, isLoading: action.isLoading }
    case REQUEST_DATA_API:
      return { ...state, isLoading: action.isLoading }
    default:
      return state
  }
}
