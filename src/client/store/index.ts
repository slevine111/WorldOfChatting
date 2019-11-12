import {
  createStore,
  combineReducers,
  applyMiddleware,
  Reducer
  //AnyAction
} from 'redux'
import { Language, User, UserLanguage, ChatGroup } from '../../entities'
import languageReducer from './language/reducer'
import userReducer from './user/reducer'
import userLanguageReducer from './userlanguage/reducer'
import chatGroupReducer from './chatgroup/reducer'
import authReducer from './auth/reducer'
import { IAuthReducerState } from './auth/types'
//import { LanguageActionTypes } from './language/types'
//import { UserActionTypes } from './user/types'
//import { UserLanguageActionTypes } from './userlanguage/types'
//import { LoggedInUserActionTypes } from './loggedinuser/types'
//import { AccessTokenActionTypes } from './accessToken/types_actions'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import refreshTokenMiddleware from './auth/middleware'

interface ICombinedReducer {
  languages: Language[]
  users: User[]
  userLanguages: UserLanguage[]
  chatGroups: ChatGroup[]
  auth: IAuthReducerState
}

const rootReducer: Reducer<ICombinedReducer> = combineReducers({
  languages: languageReducer,
  users: userReducer,
  userLanguages: userLanguageReducer,
  chatGroups: chatGroupReducer,
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
