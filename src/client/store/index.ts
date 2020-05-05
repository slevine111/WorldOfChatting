import { createStore, combineReducers, applyMiddleware } from 'redux'
import languageReducer from './language/reducer'
import userReducer from './user/reducer'
import { NO_DIRECT_CHAT_WITH_KEY } from './user/constants'
import userLanguageReducer, {
  LOGGED_IN_USER_SUBGROUPING_KEY,
} from './userlanguage/reducer'
import chatGroupReducer from './chatgroup/reducer'
import {
  FAVORITE_CHAT_GROUPS_KEY,
  CHAT_GROUPS_WITH_MESSAGES_KEY,
  CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
  CHAT_GROUPS_NO_MESSAGES_KEY,
} from './chatgroup/helperfunctions'
import userChatGroupReducer from './userchatgroup/reducer'
import chatGroupInviteReducer from './chatgroupinvite/reducer'
import authReducer from './auth/reducer'
import notificationReducer from './notification/reducer'
import { NOT_SEEN } from './notification/types'
import messageReducer from './message/reducer'
import uiReducer from './ui/reducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {
  refreshTokenMiddleware,
  callAPIMiddleware,
} from './APIRequestsHandling/apiMiddleware'
import socketMiddleware from './socket/middleware'
import { createReducerSlice } from './utilityfunctions'

const rootReducer = combineReducers({
  languages: languageReducer,
  users: createReducerSlice(userReducer, NO_DIRECT_CHAT_WITH_KEY),
  userLanguages: createReducerSlice(
    userLanguageReducer,
    LOGGED_IN_USER_SUBGROUPING_KEY
  ),
  chatGroups: createReducerSlice(chatGroupReducer, [
    FAVORITE_CHAT_GROUPS_KEY,
    CHAT_GROUPS_WITH_MESSAGES_KEY,
    CHAT_GROUPS_NO_MESSAGES_KEY,
    CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
  ]),
  userChatGroups: createReducerSlice(userChatGroupReducer),
  auth: authReducer,
  notifications: createReducerSlice(notificationReducer, NOT_SEEN),
  chatGroupInvites: createReducerSlice(chatGroupInviteReducer),
  messages: createReducerSlice(messageReducer),
  ui: uiReducer,
})

export type ReduxState = ReturnType<typeof rootReducer>

const getMiddlewareArray = (environmentMode: string | undefined): any[] => {
  return [
    refreshTokenMiddleware,
    callAPIMiddleware,
    thunk,
    socketMiddleware,
    ...(environmentMode === 'development' ? [logger] : []),
  ]
}

const store = createStore(
  rootReducer,
  applyMiddleware(...getMiddlewareArray(process.env.NODE_ENV))
)

export type MyStoreType = typeof store

export default store
