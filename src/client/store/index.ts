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
import userChatGroupReducer, {
  UCG_LOGGED_IN_USER_KEY,
} from './userchatgroup/reducer'
import chatGroupInviteReducer from './chatgroupinvite/reducer'
import authReducer, { authInitialState } from './auth/reducer'
import notificationReducer from './notification/reducer'
import { NOT_SEEN } from './notification/types'
import messageReducer from './message/reducer'
import uiReducer, { uiInitialState } from './ui/reducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {
  refreshTokenMiddleware,
  callAPIMiddleware,
} from './APIRequestsHandling/apiMiddleware'
import socketMiddleware from './socket/middleware'
import { createReducerSlice, createInitialState } from './utilityfunctions'

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

const initialState: ReduxState = {
  languages: createInitialState(),
  users: createInitialState(NO_DIRECT_CHAT_WITH_KEY),
  userLanguages: createInitialState(LOGGED_IN_USER_SUBGROUPING_KEY),
  chatGroups: createInitialState([
    FAVORITE_CHAT_GROUPS_KEY,
    CHAT_GROUPS_WITH_MESSAGES_KEY,
    CHAT_GROUPS_NO_MESSAGES_KEY,
    CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
  ]),
  userChatGroups: createInitialState(UCG_LOGGED_IN_USER_KEY),
  auth: authInitialState,
  notifications: createInitialState(NOT_SEEN),
  chatGroupInvites: createInitialState(),
  messages: createInitialState(),
  ui: uiInitialState,
}

const loadState = (): ReduxState => {
  const savedUIState: string | null = localStorage.getItem('uiState')
  if (savedUIState != null) {
    const { apiCalling, ...nonAPICallingFields } = JSON.parse(savedUIState)
    return {
      ...initialState,
      ui: { apiCalling: initialState.ui.apiCalling, ...nonAPICallingFields },
    }
  }
  return initialState
}

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
  loadState(),
  applyMiddleware(...getMiddlewareArray(process.env.NODE_ENV))
)

store.subscribe(() => {
  localStorage.setItem('uiState', JSON.stringify(store.getState().ui))
})

export type MyStoreType = typeof store

export default store
