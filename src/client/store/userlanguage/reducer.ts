import {
  LOGOUT_USER_PROCESS,
  WENT_TO_LANGUAGE_PAGE_VIEW,
  REQUEST_DATA_API
} from '../shared/types'
import { SharedActionsTypes } from '../shared/actions'
import { UserLanguage } from '../../../entities'

export interface IUserLangugeReducer {
  data: UserLanguage[]
  isLoading: boolean
}

const initialState: IUserLangugeReducer = { data: [], isLoading: false }

export default (
  state: IUserLangugeReducer = { ...initialState },
  action: SharedActionsTypes
): IUserLangugeReducer => {
  switch (action.type) {
    case LOGOUT_USER_PROCESS:
      return { ...initialState }
    case WENT_TO_LANGUAGE_PAGE_VIEW:
      return { data: action.userLanguages, isLoading: action.isLoading }
    case REQUEST_DATA_API:
      return { ...state, isLoading: true }
    default:
      return state
  }
}
