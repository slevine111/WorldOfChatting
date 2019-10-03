import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import { Language, User, UserLanguage } from '../../entities'
import languageReducer from './language/reducer'
import userReducer from './user/reducer'
import userLanguageReducer from './userlanguage/reducer'
import loggedInUserReducer from './loggedinuser/reducer'
import { LanguageActionTypes } from './language/types'
import { UserActionTypes } from './user/types'
import { UserLanguageActionTypes } from './userlanguage/types'
import { LoggedInUserActionTypes } from './loggedinuser/types'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

interface ICombinedReducer {
  languages: Language[]
  users: User[]
  userLanguages: UserLanguage[]
  loggedInUser: User
}

const rootReducer: Reducer<
  ICombinedReducer,
  | LanguageActionTypes
  | UserActionTypes
  | UserLanguageActionTypes
  | LoggedInUserActionTypes
> = combineReducers({
  languages: languageReducer,
  users: userReducer,
  userLanguages: userLanguageReducer,
  loggedInUser: loggedInUserReducer
})

export type ReduxState = ReturnType<typeof rootReducer>

const getMiddlewareArray = (environmentMode: string | undefined): any[] => {
  return [thunk, ...(environmentMode === 'development' ? [logger] : [])]
}

export default createStore(
  rootReducer,
  applyMiddleware(...getMiddlewareArray(process.env.NODE_ENV))
)
