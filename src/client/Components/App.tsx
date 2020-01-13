//React related imports
import React, { ReactElement, Fragment, useEffect } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { ReduxState } from '../store'
import { User } from '../../entities'
import { getAllLanguagesThunk } from '../store/language/actions'
import { checkIfUserLoggedInProcess } from '../store/auth/thunks'
import { checkError, GeneralErrorTypes } from './utilityfunctions'

//Components imports
import Signup from './Login_Signup/Signup'
import Login from './Login_Signup/Login'
import Navbar from './Navbar'
//import Home from './Home/'
//import LanguagePage from './LanguagePage'
//import ProtectedLoggedInPageHOC from './ProtectedLoggedInPageHOC'
import LoggedInUserController from './LoggedInUserController'

interface IReduxStateProps {
  user: User
  nonAuthenticationError: boolean
}

interface IDispatchProps {
  getAllLanguages: () => void
  checkIfUserLoggedIn: () => void
}

const App: React.FC<IReduxStateProps & IDispatchProps> = ({
  getAllLanguages,
  checkIfUserLoggedIn,
  user,
  nonAuthenticationError
}): ReactElement => {
  useEffect(() => {
    Promise.all([getAllLanguages(), checkIfUserLoggedIn()])
  }, [])
  console.log('in app')

  return (
    <div>
      <HashRouter>
        <Fragment>
          <Route component={Navbar} />
          {nonAuthenticationError && <div>site failed to load :(</div>}
          {!nonAuthenticationError && (
            <Switch>
              <Route path="/" exact component={Login} />
              <Route
                path="/about"
                exact
                render={() => <h4>the about page</h4>}
              />
              <Route path="/signup" exact component={Signup} />
              <Route path="/login" exact component={Login} />
              {user.id && <LoggedInUserController />}
              <Route exact render={() => <h4>url does not exist</h4>} />
            </Switch>
          )}
        </Fragment>
      </HashRouter>
    </div>
  )
}

const mapStateToProps = ({ auth, languages }: ReduxState): IReduxStateProps => {
  return {
    user: auth.user.data,
    nonAuthenticationError: [auth.error, languages.error].some(
      slice => checkError(slice) === GeneralErrorTypes.NON_AUTHENTICATION_ERROR
    )
  }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    getAllLanguages: () => dispatch(getAllLanguagesThunk()),
    checkIfUserLoggedIn: () => dispatch(checkIfUserLoggedInProcess())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
