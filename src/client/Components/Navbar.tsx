import React, { ReactElement } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../store/index'
import { logoutUserProcessThunk } from '../store/APIRequestsHandling/multiplereducerthunks'
import { History } from 'history'

//Material-UI components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

//MaterIal-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const useStyles: Style = makeStyles(theme => ({
  siteNameLink: { textDecoration: 'none', color: 'white', width: '100%' },
  buttonStyle: {
    textTransform: 'none',
    color: 'inherit'
  },
  aboutButton: { marginLeft: '15px' },
  toolbar: theme.mixins.toolbar
}))

const Navbar: React.FC<{ history: History }> = ({ history }): ReactElement => {
  const dispatch = useDispatch()
  const {
    auth: { user }
  } = useSelector((state: ReduxState) => state)
  const classes = useStyles()
  return (
    <div>
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
                dispatch(logoutUserProcessThunk(user.id, { loggedIn: false }))
              }
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
    </div>
  )
}

export default Navbar
