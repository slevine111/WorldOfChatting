import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import languageReducer, { ILanguageReducerState } from './language/reducer'
import userReducer, { IUserReducerState } from './user/reducer'
import userLanguageReducer, {
  IUserLangugeReducerState
} from './userlanguage/reducer'
import chatGroupReducer, { IChatGroupReducerState } from './chatgroup/reducer'
import userChatGroupReducer, {
  IUserChatGroupReducerState
} from './userchatgroup/reducer'
import authReducer, { IAuthReducerState } from './auth/reducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { refreshTokenMiddleware, callAPIMiddleware } from './apiMiddleware'

interface ICombinedReducer {
  languages: ILanguageReducerState
  users: IUserReducerState
  userLanguages: IUserLangugeReducerState
  chatGroups: IChatGroupReducerState
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
    callAPIMiddleware,
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
