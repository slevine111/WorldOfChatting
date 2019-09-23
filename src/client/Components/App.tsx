//React related imports
import React, { ReactElement, Fragment, useEffect } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAllLanguagesThunk } from '../store/language/actions'
import { LanguageDispatch } from '../store/language/types'

//Material-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

//Components imports
import Signup from './Login_Signup/Signup'
import Login from './Login_Signup/Login'
import Navbar from './Navbar'

const useStyles: Style = makeStyles((theme: any) => ({
  toolbar: theme.mixins.toolbar
}))

interface IDispatchProps {
  getAllLanguages: () => void
}

interface IAppProps extends IDispatchProps {}

const App: React.FC<IAppProps> = ({ getAllLanguages }): ReactElement => {
  useEffect(() => {
    getAllLanguages()
  })
  const classes = useStyles()
  return (
    <div>
      <HashRouter>
        <Fragment>
          <Route component={Navbar} />
          <div className={classes.toolbar} />
          <Route path="/" exact component={Login} />
          <Route path="/about" exact render={() => <h4>the about page</h4>} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/login" exact component={Login} />
        </Fragment>
      </HashRouter>
    </div>
  )
}

const mapDispatchToProps = (dispatch: LanguageDispatch): IDispatchProps => {
  return {
    getAllLanguages: () => dispatch(getAllLanguagesThunk())
  }
}

export default connect(
  null,
  mapDispatchToProps
)(App)
