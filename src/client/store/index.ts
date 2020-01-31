import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import languageReducer, { ILanguageReducerState } from './language/reducer'
import userReducer, { IUserReducerState } from './user/reducer'
import userLanguageReducer, {
  IUserLanguageReducerState
} from './userlanguage/reducer'
import chatGroupReducer, { IChatGroupReducerState } from './chatgroup/reducer'
import userChatGroupReducer, {
  IUserChatGroupReducerState
} from './userchatgroup/reducer'
import authReducer, { IAuthReducerState } from './auth/reducer'
import notificationReducer, {
  INotificationReducerState
} from './notification/reducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {
  refreshTokenMiddleware,
  callAPIMiddleware
} from './APIRequestsHandling/apiMiddleware'

interface ICombinedReducer {
  languages: ILanguageReducerState
  users: IUserReducerState
  userLanguages: IUserLanguageReducerState
  chatGroups: IChatGroupReducerState
  userChatGroups: IUserChatGroupReducerState
  auth: IAuthReducerState
  notifications: INotificationReducerState
}

const rootReducer: Reducer<ICombinedReducer> = combineReducers({
  languages: languageReducer,
  users: userReducer,
  userLanguages: userLanguageReducer,
  chatGroups: chatGroupReducer,
  userChatGroups: userChatGroupReducer,
  auth: authReducer,
  notifications: notificationReducer
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
