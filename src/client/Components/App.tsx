//React related imports
import React, { ReactElement, Fragment, useEffect } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { ReduxState } from '../store'
import { IAuthReducerState } from '../store/auth/reducer'
import { getAllLanguagesThunk } from '../store/language/actions'
import { checkIfUserLoggedInProcess } from '../store/auth/thunks'

//Material-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

//Components imports
import Signup from './Login_Signup/Signup'
import Login from './Login_Signup/Login'
import Navbar from './Navbar'
//import Home from './Home/'
//import LanguagePage from './LanguagePage'
//import ProtectedLoggedInPageHOC from './ProtectedLoggedInPageHOC'
import LoggedInUserController from './LoggedInUserController'

const useStyles: Style = makeStyles((theme: any) => ({
  toolbar: theme.mixins.toolbar
}))

interface ITest {
  auth: IAuthReducerState
}

interface IDispatchProps {
  getAllLanguages: () => void
  checkIfUserLoggedIn: () => void
}

interface IAppProps extends IDispatchProps, ITest {}

const App: React.FC<IAppProps> = ({
  getAllLanguages,
  checkIfUserLoggedIn,
  auth
}): ReactElement => {
  useEffect(() => {
    Promise.all([getAllLanguages(), checkIfUserLoggedIn()])
  }, [])
  const classes = useStyles()

  if (auth.error !== null) {
    if (auth.error.statusCode !== 401) {
      return <div>site failed to load</div>
    }
  }

  return (
    <div>
      <HashRouter>
        <Fragment>
          <Route component={Navbar} />
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/about" exact render={() => <h4>the about page</h4>} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/login" exact component={Login} />
            {auth.user.id && <LoggedInUserController />}
            <Route exact render={() => <h4>url does not exist</h4>} />
          </Switch>
        </Fragment>
      </HashRouter>
    </div>
  )
}

const mapStateToProps = ({ auth }: ReduxState) => ({ auth })

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    getAllLanguages: () => dispatch(getAllLanguagesThunk()),
    checkIfUserLoggedIn: () => dispatch(checkIfUserLoggedInProcess())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
