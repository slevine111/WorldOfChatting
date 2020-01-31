//React related imports
import React, { ReactElement, Fragment, useEffect } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../store'
import { getAllLanguagesThunk } from '../store/language/actions'
import { checkIfUserLoggedInProcess } from '../store/auth/thunks'

//Components imports
import Signup from './Login_Signup/Signup'
import Login from './Login_Signup/Login'
import Navbar from './Navbar'
import LoggedInUserController from './LoggedInUserController'

interface IOwnProps {
  redirectAfterLogin: string
}

const App: React.FC<IOwnProps> = ({ redirectAfterLogin }): ReactElement => {
  const { user } = useSelector(({ auth }: ReduxState) => ({
    user: auth.user.data
  }))
  const dispatch = useDispatch()

  let websiteLoadError: boolean = false
  useEffect(() => {
    Promise.all([
      dispatch(getAllLanguagesThunk()),
      dispatch(checkIfUserLoggedInProcess())
    ])
      .then(() => {
        window.location.hash = redirectAfterLogin
      })
      .catch(err => {
        websiteLoadError = err.response.status !== 401
      })
  }, [])

  return (
    <div>
      <HashRouter>
        <Fragment>
          <Route component={Navbar} />
          {websiteLoadError && <div>site failed to load :(</div>}
          {!websiteLoadError && (
            <Switch>
              <Route
                path="/about"
                exact
                render={() => <h4>the about page</h4>}
              />
              {!user.id && <Route path="/" exact component={Login} />}
              {!user.id && <Route path="/login" exact component={Login} />}
              {!user.id && <Route path="/signup" exact component={Signup} />}
              {!user.id && <Redirect to="/login" />}
              {user.id && <Route component={LoggedInUserController} />}
              <Route exact render={() => <h4>url does not exist</h4>} />
            </Switch>
          )}
        </Fragment>
      </HashRouter>
    </div>
  )
}

export default App
