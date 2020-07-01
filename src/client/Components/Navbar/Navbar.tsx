import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../store/index'
import { History } from 'history'
import LoggedInUserHeadings from './LoggedInUserHeadings'
import { NAVBAR_HEIGHT } from '../globalstyles'

//Material-UI components
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import styles from './styles'

const Navbar: React.FC<{
  history: History
}> = ({ history }) => {
  const width410OrMore = useMediaQuery('(min-width:410px)')
  const user = useSelector((state: ReduxState) => state.auth.user)

  const classes = styles()
  return (
    <AppBar
      position="sticky"
      style={{ height: NAVBAR_HEIGHT, flexDirection: 'row' }}
    >
      <Button
        className={classes.buttonStyle}
        onClick={() => history.push(user.id ? '/home' : '/')}
      >
        <Typography variant="h6">World of Chatting</Typography>
      </Button>
      {(!user.id || width410OrMore) && (
        <Button
          className={`${classes.aboutButton} ${classes.buttonStyle}`}
          onClick={() => history.push('/about')}
        >
          About
        </Button>
      )}
      {!!user.id && <LoggedInUserHeadings />}
    </AppBar>
  )
}

export default Navbar
