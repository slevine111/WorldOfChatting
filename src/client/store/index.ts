import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import { Language, UserLanguage } from '../../entities'
import { IChatGroupReducer } from '../../shared-types'
import languageReducer from './language/reducer'
import userReducer, { IUserReducerState } from './user/reducer'
import userLanguageReducer from './userlanguage/reducer'
import chatGroupReducer from './chatgroup/reducer'
import userChatGroupReducer, {
  IUserChatGroupReducerState
} from './userchatgroup/reducer'
import authReducer from './auth/reducer'
import { IAuthReducerState } from './auth/types'

import thunk from 'redux-thunk'
import logger from 'redux-logger'
import refreshTokenMiddleware from './auth/middleware'

interface ICombinedReducer {
  languages: Language[]
  users: IUserReducerState
  userLanguages: UserLanguage[]
  chatGroups: IChatGroupReducer[]
  userChatGroups: IUserChatGroupReducerState
  auth: IAuthReducerState
}

const rootReducer: Reducer<ICombinedReducer> = combineReducers({
  languages: languageReducer,
  users: userReducer,
  userLanguages: userLanguageReducer,
  chatGroups: chatGroupReducer,
  userChatGroups: userChatGroupReducer,
  auth: authReducer
})

export type ReduxState = ReturnType<typeof rootReducer>

const getMiddlewareArray = (environmentMode: string | undefined): any[] => {
  return [
    refreshTokenMiddleware,
    thunk,
    ...(environmentMode === 'development' ? [logger] : [])
  ]
}

const store = createStore(
  rootReducer,
  applyMiddleware(...getMiddlewareArray(process.env.NODE_ENV))
)

export type MyStoreType = typeof store

export default store
