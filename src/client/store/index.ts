import { createStore, combineReducers, applyMiddleware } from 'redux'
import languageReducer from './language/reducer'
import userReducer from './user/reducer'
import userLanguageReducer, {
  LOGGED_IN_USER_SUBGROUPING_KEY
} from './userlanguage/reducer'
import chatGroupReducer, { FAVORITE_CHAT_GROUPS_KEY } from './chatgroup/reducer'
import userChatGroupReducer from './userchatgroup/reducer'
import authReducer from './auth/reducer'
import notificationReducer from './notification/reducer'
import { UNREAD_NOTIFICATIONS_KEY } from './notification/helperfunctions'
import uiReducer from './ui/reducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {
  refreshTokenMiddleware,
  callAPIMiddleware
} from './APIRequestsHandling/apiMiddleware'
import { createReducerSlice } from './utilityfunctions'

const rootReducer = combineReducers({
  languages: languageReducer,
  users: createReducerSlice(userReducer),
  userLanguages: createReducerSlice(
    userLanguageReducer,
    LOGGED_IN_USER_SUBGROUPING_KEY
  ),
  chatGroups: createReducerSlice(chatGroupReducer, FAVORITE_CHAT_GROUPS_KEY),
  userChatGroups: createReducerSlice(userChatGroupReducer),
  auth: authReducer,
  notifications: createReducerSlice(
    notificationReducer,
    UNREAD_NOTIFICATIONS_KEY
  ),
  ui: uiReducer
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
