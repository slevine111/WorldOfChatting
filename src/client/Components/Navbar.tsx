import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ReduxState } from '../store/index'
import { User } from '../../entities'
import { logoutUserProcess } from '../store/shared-actions'
import { IUserUpdateDTO } from '../../server/users/users.dto'
import { ThunkDispatch } from 'redux-thunk'

//Material-UI components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

//MaterIal-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'
import { AnyAction } from 'redux'

interface IReduxStateProps {
  user: User
}

interface IDispatchProps {
  logoutUser: (
    userId: string,
    updatedUserFields: IUserUpdateDTO
  ) => Promise<void>
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
            onClick={() => logoutUser(user.id, { loggedIn: false })}
          >
            Logout
          </Link>
        )}
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = ({ auth: { user } }: ReduxState): IReduxStateProps => ({
  user
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): IDispatchProps => {
  return {
    logoutUser: (userId, updatedUserFields) =>
      dispatch(logoutUserProcess(userId, updatedUserFields))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
