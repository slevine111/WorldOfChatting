import { createStore, combineReducers, applyMiddleware, Reducer } from 'redux'
import { Language } from '../../entities'
import languageReducer from './language/reducer'
import { LanguageActionTypes } from './language/types'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
    }
  }
}

interface ICombineReducer {
  languages: Language[]
}

const rootReducer: Reducer<
  ICombineReducer,
  LanguageActionTypes
> = combineReducers({
  languages: languageReducer
})

export type ReduxState = ReturnType<typeof rootReducer>

const getMiddlewareArray = (environmentMode: string): any[] => {
  return [thunk, ...(environmentMode === 'development' ? [logger] : [])]
}

export default createStore(
  rootReducer,
  applyMiddleware(...getMiddlewareArray(process.env.NODE_ENV))
)
