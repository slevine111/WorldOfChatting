import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import { Provider } from 'react-redux'
import store from './store'

const redirectAfterLogin: string = window.location.hash.slice(1)

ReactDOM.render(
  <Provider store={store}>
    <App {...{ redirectAfterLogin }} />
  </Provider>,
  document.querySelector('#app')
)
