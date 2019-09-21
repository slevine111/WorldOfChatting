import { createStore, combineReducers, applyMiddleware } from 'redux'
import languageReducer from './language/reducer'
import thunk from 'redux-thunk'

export default createStore(
  combineReducers({ languages: languageReducer }),
  applyMiddleware(thunk)
)
