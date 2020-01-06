import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import { Language } from '../../entities'
import { IChatGroupReducer } from '../../shared-types'
import languageReducer from './language/reducer'
import userReducer, { IUserReducerState } from './user/reducer'
import userLanguageReducer, {
  IUserLangugeReducer
} from './userlanguage/reducer'
import chatGroupReducer from './chatgroup/reducer'
import userChatGroupReducer, {
  IUserChatGroupReducer
} from './userchatgroup/reducer'
import authReducer from './auth/reducer'
import { IAuthReducerState } from './auth/types'

import thunk from 'redux-thunk'
import logger from 'redux-logger'
import refreshTokenMiddleware from './auth/middleware'
import callAPIMiddleware from './callAPIMiddleware'

interface ICombinedReducer {
  languages: Language[]
  users: IUserReducerState
  userLanguages: IUserLangugeReducer
  chatGroups: IChatGroupReducer
  userChatGroups: IUserChatGroupReducer
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
    callAPIMiddleware,
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
