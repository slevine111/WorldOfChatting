import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../store/index'
import { History } from 'history'
import LoggedInUserHeadings from './LoggedInUserHeadings'

//Material-UI components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import styles from './styles'

const Navbar: React.FC<{ history: History }> = ({ history }) => {
  const {
    auth: { user }
  } = useSelector((state: ReduxState) => state)
  const classes = styles()
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
          {!!user.id && <LoggedInUserHeadings />}
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
    </div>
  )
}

export default Navbar
