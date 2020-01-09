import React, { ReactElement } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../store/index'
import { User } from '../../entities'
import { logoutUserProcessThunk } from '../store/shared/thunks'
import { IUserUpdateDTO } from '../../server/users/users.dto'
import { History } from 'history'

//Material-UI components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

//MaterIal-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

interface IReduxStateProps {
  user: User
}

interface IDispatchProps {
  logoutUser: (
    userId: string,
    updatedUserFields: IUserUpdateDTO
  ) => Promise<void>
}

interface INavbarProps extends IReduxStateProps, IDispatchProps {
  history: History
}

const useStyles: Style = makeStyles({
  siteNameLink: { textDecoration: 'none', color: 'white', width: '100%' },
  buttonStyle: {
    textTransform: 'none',
    color: 'inherit'
  },
  aboutButton: { marginLeft: '15px' }
})

const Navbar: React.FC<INavbarProps> = ({
  user,
  logoutUser,
  history
}): ReactElement => {
  const classes = useStyles()
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Button
          className={classes.buttonStyle}
          onClick={() => history.push(user.id ? '/home' : '/')}
        >
          <Typography variant="h6">World of Chatting</Typography>
        </Button>
        <Button
          className={`${classes.aboutButton} ${classes.buttonStyle}`}
          onClick={() => history.push('/about')}
        >
          About
        </Button>
        {user.id && (
          <Button
            className={classes.buttonStyle}
            onClick={() =>
              logoutUser(user.id, { loggedIn: false }).then(() =>
                history.push('/')
              )
            }
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = ({ auth: { user } }: ReduxState): IReduxStateProps => ({
  user
})

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    logoutUser: (userId, updatedUserFields) =>
      dispatch(logoutUserProcessThunk(userId, updatedUserFields))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
