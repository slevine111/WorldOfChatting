import { createStore, combineReducers, applyMiddleware } from 'redux'
import {
  languageInitialState,
  languageReducer,
  userReducer,
  userInitialState,
  userChatGroupInitialState,
  userChatGroupReducer,
  userLanguageInitialState,
  userLanguageReducer,
  chatGroupInitialState,
  chatGroupReducer,
  chatGroupInviteInitialState,
  chatGroupInviteReducer,
  authInitialState,
  authReducer,
  notificationInitialState,
  notificationReducer,
  messageInitialState,
  messageReducer,
  uiInitialState,
  uiReducer,
} from './reducers'
import { getMiddlewareArray } from './middleware/utilityfunctions'
import { createReducerSlice } from './utilityfunctions'

const rootReducer = combineReducers({
  languages: createReducerSlice(languageReducer, languageInitialState),
  users: createReducerSlice(userReducer, userInitialState),
  userLanguages: createReducerSlice(
    userLanguageReducer,
    userLanguageInitialState
  ),
  chatGroups: createReducerSlice(chatGroupReducer, chatGroupInitialState),
  userChatGroups: createReducerSlice(
    userChatGroupReducer,
    userChatGroupInitialState
  ),
  auth: authReducer,
  notifications: createReducerSlice(
    notificationReducer,
    notificationInitialState
  ),
  chatGroupInvites: createReducerSlice(
    chatGroupInviteReducer,
    chatGroupInviteInitialState
  ),
  messages: createReducerSlice(messageReducer, messageInitialState),
  ui: uiReducer,
})

export type ReduxState = ReturnType<typeof rootReducer>

const initialState: ReduxState = {
  languages: languageInitialState,
  users: userInitialState,
  userLanguages: userLanguageInitialState,
  chatGroups: chatGroupInitialState,
  userChatGroups: userChatGroupInitialState,
  auth: authInitialState,
  notifications: notificationInitialState,
  chatGroupInvites: chatGroupInviteInitialState,
  messages: messageInitialState,
  ui: uiInitialState,
}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...getMiddlewareArray(process.env.NODE_ENV))
)

export type MyStoreType = typeof store

export default store
