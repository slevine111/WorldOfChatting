//React related imports
import React, { ReactElement, Fragment } from 'react'
import { HashRouter, Route } from 'react-router-dom'

//Material-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

//Components imports
import Signup from './Signup/Signup'
import Navbar from './Navbar'

const useStyles: Style = makeStyles((theme: any) => ({
  toolbar: theme.mixins.toolbar
}))

const App: React.FC<{}> = (): ReactElement => {
  const classes = useStyles()
  return (
    <div>
      <HashRouter>
        <Fragment>
          <Route component={Navbar} />
          <div className={classes.toolbar} />
          <Route path="/" exact render={() => <h5>another page</h5>} />
          <Route path="/about" exact render={() => <h4>the about page</h4>} />
          <Route path="/signup" exact component={Signup} />
        </Fragment>
      </HashRouter>
    </div>
  )
}

export default App
