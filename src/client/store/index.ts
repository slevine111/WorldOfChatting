import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import { Language, User, UserLanguage } from '../../entities'
import languageReducer from './language/reducer'
import userReducer from './user/reducer'
import userLanguageReducer from './userlanguage/reducer'
import { LanguageActionTypes } from './language/types'
import { UserActionTypes } from './user/types'
import { UserLanguageActionTypes } from './userlanguage/types'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
    }
  }
}

interface ICombinedReducer {
  languages: Language[]
  users: User[]
  userLanguages: UserLanguage[]
}

const rootReducer: Reducer<
  ICombinedReducer,
  LanguageActionTypes | UserActionTypes | UserLanguageActionTypes
> = combineReducers({
  languages: languageReducer,
  users: userReducer,
  userLanguages: userLanguageReducer
})

export type ReduxState = ReturnType<typeof rootReducer>

const getMiddlewareArray = (environmentMode: string): any[] => {
  return [thunk, ...(environmentMode === 'development' ? [logger] : [])]
}

export default createStore(
  rootReducer,
  applyMiddleware(...getMiddlewareArray(process.env.NODE_ENV))
)
