import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ReduxState } from '../store/index'
import { User } from '../../entities'
import { logoutUserThunk } from '../store/loggedinuser/actions'
import { ISetLoggedInUserAction } from '../store/loggedinuser/types'
import { ThunkDispatch } from 'redux-thunk'

//Material-UI components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

//MaterIal-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

interface IReduxStateProps {
  user: User
}

interface IDispatchProps {
  logoutUser: () => void
}

interface INavbarProps extends IReduxStateProps, IDispatchProps {}

const useStyles: Style = makeStyles({
  aboutLink: {
    textDecoration: 'none',
    color: 'white',
    marginLeft: '10%'
  }
})

const Navbar: React.FC<INavbarProps> = ({ user, logoutUser }): ReactElement => {
  const classes = useStyles()
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">World of Chatting</Typography>
        <Link to="/about" className={classes.aboutLink}>
          About
        </Link>
        {user.id && (
          <Link
            to="/"
            className={classes.aboutLink}
            onClick={() => logoutUser()}
          >
            Logout
          </Link>
        )}
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = ({ loggedInUser }: ReduxState): IReduxStateProps => ({
  user: loggedInUser
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch<void, null, ISetLoggedInUserAction>
): IDispatchProps => {
  return {
    logoutUser: () => dispatch(logoutUserThunk())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)
